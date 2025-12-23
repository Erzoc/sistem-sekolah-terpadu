import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/client";
import { usersTable } from "@/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('[AUTH] 🔐 Login attempt:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] ❌ Missing credentials');
          return null;
        }

        try {
          console.log('[AUTH] 🔍 Querying database...');
          const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, credentials.email))
            .limit(1);

          console.log('[AUTH] 📊 Query result:', users.length, 'users found');

          if (users.length === 0) {
            console.log('[AUTH] ❌ User not found:', credentials.email);
            return null;
          }

          const user = users[0];
          console.log('[AUTH] ✅ User found:', {
            id: user.userId,
            email: user.email,
            role: user.role,
            hasPassword: !!user.passwordHash
          });

          if (!user.passwordHash) {
            console.log('[AUTH] ❌ No password hash in database');
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          console.log('[AUTH] 🔑 Password check:', isValidPassword ? '✅ Valid' : '❌ Invalid');

          if (!isValidPassword) {
            console.log('[AUTH] ❌ Invalid password for:', credentials.email);
            return null;
          }

          console.log('[AUTH] ✅ Login successful:', user.email, '| Role:', user.role);
          
          // Map role from schema to frontend
          const mappedRole = user.role === 'super_admin' ? 'superadmin' : user.role;
          
          return {
            id: user.userId,
            email: user.email,
            name: user.fullName || user.email,
            role: mappedRole, // Map 'super_admin' → 'superadmin' for middleware
            tenantId: user.tenantId || null,
          };

        } catch (error) {
          console.error('[AUTH] 💥 Database error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('[JWT] 🎫 Creating token for:', user.email);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        console.log('[SESSION] 👤 Creating session for:', token.email, '| Role:', token.role);
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
