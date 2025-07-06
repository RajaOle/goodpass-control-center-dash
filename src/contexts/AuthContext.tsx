import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

// Define types based on the database schema
type UserRole = 'superadmin' | 'admin' | 'moderator' | 'viewer'

interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  role: string | null
  status: string | null
  is_kyc_completed: boolean | null
  created_at: string | null
  updated_at: string | null
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isSuperAdmin: boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Error fetching user profile:', error)
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        
        // For superadmin, set a default profile
        if (userId === '416c81b2-aab3-4371-8b69-7c8b2eff0eaf') {
          console.log('Setting default superadmin profile');
          const defaultProfile: UserProfile = {
            id: userId,
            email: 'virtue.appscore@gmail.com',
            phone: null,
            role: 'superadmin',
            status: 'active',
            is_kyc_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUserProfile(defaultProfile)
        }
      } else {
        console.log('Profile found:', data);
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        await fetchUserProfile(data.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
  }

  const isSuperAdmin = userProfile?.role === 'superadmin'
  
  const hasRole = (role: UserRole) => {
    if (!userProfile) return false
    
    const roleHierarchy: Record<UserRole, number> = {
      'viewer': 1,
      'moderator': 2,
      'admin': 3,
      'superadmin': 4
    }
    
    return roleHierarchy[userProfile.role as UserRole] >= roleHierarchy[role]
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signOut,
    isSuperAdmin,
    hasRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 