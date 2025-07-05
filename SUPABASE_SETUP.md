# Supabase Setup Guide

This guide will help you set up Supabase authentication for your Goodpass Backoffice application.

## Prerequisites

- Supabase project ID: `nnkeqdvbkudgfrtkskae`
- Default admin credentials:
  - Email: `virtue.appscore@gmail.com`
  - Password: `OpenOpen123!!`

## Step 1: Get Your Supabase API Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`nnkeqdvbkudgfrtkskae`)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://nnkeqdvbkudgfrtkskae.supabase.co`
   - **anon public key**: (starts with `eyJ...`)

## Step 2: Update Configuration

1. Open `src/lib/supabase.ts`
2. Replace `'your-anon-key-here'` with your actual anon public key:

```typescript
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your actual key here
```

## Step 3: Set Up Database Tables

1. In your Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Run the script to create the necessary tables and policies

## Step 4: Create the Default Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter the following details:
   - Email: `virtue.appscore@gmail.com`
   - Password: `OpenOpen123!!`
   - Email Confirm: `true` (to skip email verification)
4. Click **Create User**

## Step 5: Set User Role

After creating the user, you need to set their role to superadmin:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query (replace `USER_UUID` with the actual UUID of the user you just created):

```sql
INSERT INTO user_profiles (id, email, role) 
VALUES ('USER_UUID_HERE', 'virtue.appscore@gmail.com', 'superadmin')
ON CONFLICT (id) DO UPDATE SET role = 'superadmin';
```

To find the user's UUID:
1. Go to **Authentication** → **Users**
2. Click on the user `virtue.appscore@gmail.com`
3. Copy the **ID** field (this is the UUID)

## Step 6: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:8080`
3. You should see the login page
4. You can either:
   - Enter the credentials manually: `virtue.appscore@gmail.com` / `OpenOpen123!!`
   - Click the "Use Default Admin" button to auto-fill the credentials
5. Click "Sign In" to authenticate

## Role-Based Access Control

The application supports the following roles (in order of permissions):

- **viewer**: Basic read access
- **moderator**: Can moderate content
- **admin**: Full administrative access
- **superadmin**: Complete system access (highest level)

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Ensure the user was created correctly in Supabase Auth
   - Check that the user profile was created with the correct role

2. **"Access Denied" errors**
   - Verify the user has the correct role in the `user_profiles` table
   - Check that Row Level Security policies are properly configured

3. **"Network error" or connection issues**
   - Verify your Supabase URL and API key are correct
   - Check that your project is active in Supabase Dashboard

### Getting Help:

- Check the browser console for detailed error messages
- Verify your Supabase project settings
- Ensure all SQL scripts were executed successfully

## Security Notes

- The default admin credentials are hardcoded for development
- In production, remove the "Use Default Admin" button
- Consider implementing additional security measures like 2FA
- Regularly rotate API keys and passwords 