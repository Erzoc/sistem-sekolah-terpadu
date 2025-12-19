import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        role: { label: "Role", type: "text" },
      },
      authorize(credentials) {
        const role = credentials?.role;

        if (role === "superadmin") {
          return { id: "1", name: "Super Admin", email: "superadmin@sstf.id", role: "superadmin" };
        }
        if (role === "admin") {
          return { id: "2", name: "Admin Sekolah", email: "admin@sstf.id", role: "admin" };
        }
        if (role === "guru") {
          return { id: "3", name: "Guru", email: "guru@sstf.id", role: "guru" };
        }
        if (role === "siswa") {
          return { id: "4", name: "Siswa", email: "siswa@sstf.id", role: "siswa" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
