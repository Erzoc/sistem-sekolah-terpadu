import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/lib/services';

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, trigger }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
        session.user.isActive = true;
      }
      
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await authService.authenticate(
            credentials.email,
            credentials.password
          );
          return user as any;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
};
