import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/client";
import { usersTable } from "@/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .limit(1);

        if (!user || user.status !== 'active') return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);  
        if (!isValid) return null;

        return {
          id: user.userId,
          email: user.email,
          name: user.fullName,
          role: user.role,
          tenantId: user.tenantId,
        };
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string | null;
      }
      return session;
    },

    // ✅ ADD THIS: Role-based redirect after sign in
    async redirect({ url, baseUrl }) {
      // After sign in, check if it's callback URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Otherwise redirect to base URL (will be handled by middleware)
      return baseUrl;
    },
  },
};
