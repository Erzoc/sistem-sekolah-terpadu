import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        const role = credentials?.role as string;

        const users: Record<string, User> = {
          superadmin: {
            id: "1",
            name: "Super Admin",
            email: "superadmin@sstf.id",
            role: "superadmin",
          },
          admin: {
            id: "2",
            name: "Admin Sekolah",
            email: "admin@sstf.id",
            role: "admin",
          },
          guru: {
            id: "3",
            name: "Guru",
            email: "guru@sstf.id",
            role: "guru",
          },
          siswa: {
            id: "4",
            name: "Siswa",
            email: "siswa@sstf.id",
            role: "siswa",
          },
        };

        const user = users[role];
        
        if (user) {
          return user;
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
