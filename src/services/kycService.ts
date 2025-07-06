import { supabase } from '@/integrations/supabase/client';

export interface KYCVerification {
  id: number;
  user_id: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  kyc_data: any;
  created_at: string;
  verified_at?: string;
}

export interface SupportingDocument {
  id: number;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
  is_deleted: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  role: string;
  status: string;
  is_kyc_completed: boolean;
  created_at: string;
}

class KYCService {
  // Get all users who need KYC (not completed), even if they don't have a kyc_verifications record yet
  async getPendingKYC(): Promise<{ user: UserProfile; kyc: KYCVerification; documents: SupportingDocument[] }[]> {
    try {
      console.log('Fetching users needing KYC...');
      
      // Get all users who need KYC (not completed)
      const { data: usersNeedingKYC, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .or('is_kyc_completed.eq.false,is_kyc_completed.is.null')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users needing KYC:', usersError);
        throw usersError;
      }

      console.log('Users needing KYC found:', usersNeedingKYC?.length || 0);
      
      if (!usersNeedingKYC || usersNeedingKYC.length === 0) {
        return [];
      }

      const userIds = usersNeedingKYC.map(u => u.id);
      console.log('User IDs to check:', userIds);
      
      // Get KYC verifications for these users
      const { data: kycVerifications, error: kycError } = await supabase
        .from('kyc_verifications')
        .select('*')
        .in('user_id', userIds);

      if (kycError) {
        console.error('Error fetching KYC verifications:', kycError);
        throw kycError;
      }

      console.log('KYC verifications found:', kycVerifications?.length || 0);

      // Get documents for these users
      const { data: documents, error: docsError } = await supabase
        .from('supporting_documents')
        .select('*')
        .in('uploaded_by', userIds)
        .eq('is_deleted', false);

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        throw docsError;
      }

      console.log('Documents found:', documents?.length || 0);

      // Combine the data - include users even if they don't have KYC records yet
      const result = usersNeedingKYC.map(user => {
        const kyc = kycVerifications?.find(k => k.user_id === user.id);
        const userDocs = documents?.filter(d => d.uploaded_by === user.id) || [];
        
        console.log(`Processing user ${user.id}: KYC found=${!!kyc}, Documents count=${userDocs.length}`);
        
        // If no KYC record exists, create a placeholder
        const kycRecord: KYCVerification = kyc ? {
          id: kyc.id,
          user_id: kyc.user_id,
          kyc_status: (kyc.kyc_status as 'pending' | 'verified' | 'rejected') || 'pending',
          kyc_data: kyc.kyc_data,
          created_at: kyc.created_at || '',
          verified_at: kyc.verified_at || undefined
        } : {
          id: 0,
          user_id: user.id,
          kyc_status: 'pending' as const,
          kyc_data: null,
          created_at: user.created_at || '',
          verified_at: undefined
        };
        
        const userProfile: UserProfile = {
          id: user.id,
          phone: user.phone || '',
          role: user.role || 'user',
          status: user.status || 'active',
          is_kyc_completed: user.is_kyc_completed || false,
          created_at: user.created_at || ''
        };
        
        return {
          user: userProfile,
          kyc: kycRecord,
          documents: userDocs as SupportingDocument[]
        };
      });

      console.log('Final result count:', result.length);
      return result;
    } catch (error) {
      console.error('Error fetching pending KYC:', error);
      return [];
    }
  }

  // Get KYC data for a specific user
  async getUserKYCData(userId: string): Promise<{ user: UserProfile; kyc: KYCVerification; documents: SupportingDocument[] } | null> {
    try {
      // Get user profile
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get KYC verification
      const { data: kyc, error: kycError } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (kycError) throw kycError;

      // Get documents
      const { data: documents, error: docsError } = await supabase
        .from('supporting_documents')
        .select('*')
        .eq('uploaded_by', userId)
        .eq('is_deleted', false)
        .order('uploaded_at', { ascending: false });

      if (docsError) throw docsError;

      return {
        user: {
          id: user.id,
          phone: user.phone || '',
          role: user.role || 'user', 
          status: user.status || 'active',
          is_kyc_completed: user.is_kyc_completed || false,
          created_at: user.created_at || ''
        } as UserProfile,
        kyc: {
          id: kyc.id,
          user_id: kyc.user_id,
          kyc_status: (kyc.kyc_status as 'pending' | 'verified' | 'rejected') || 'pending',
          kyc_data: kyc.kyc_data,
          created_at: kyc.created_at || '',
          verified_at: kyc.verified_at || undefined
        } as KYCVerification,
        documents: (documents || []) as SupportingDocument[]
      };
    } catch (error) {
      console.error('Error fetching user KYC data:', error);
      return null;
    }
  }

  // Approve KYC
  async approveKYC(userId: string, notes?: string): Promise<boolean> {
    try {
      // Update KYC status
      const { error: kycError } = await supabase
        .from('kyc_verifications')
        .update({
          kyc_status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          is_kyc_completed: true,
          status: 'active'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error('Error approving KYC:', error);
      return false;
    }
  }

  // Reject KYC
  async rejectKYC(userId: string, reason: string): Promise<boolean> {
    try {
      // Update KYC status
      const { error: kycError } = await supabase
        .from('kyc_verifications')
        .update({
          kyc_status: 'rejected',
          kyc_data: { rejection_reason: reason }
        })
        .eq('user_id', userId);

      if (kycError) throw kycError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          is_kyc_completed: false,
          status: 'suspended'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      return false;
    }
  }

  // Get document URL from Supabase Storage
  async getDocumentUrl(filePath: string): Promise<string> {
    try {
      const { data } = await supabase.storage
        .from('kyc-document')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error getting document URL:', error);
      return '';
    }
  }
}

export const kycService = new KYCService(); 