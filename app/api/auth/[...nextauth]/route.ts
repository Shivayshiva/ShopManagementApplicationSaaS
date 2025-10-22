// NOTE: next-auth route is preserved here for future re-enable but currently
// the handler exports are disabled because the app auth setup has been removed.
// Re-enable by restoring NextAuth imports and exporting the handler.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/lib/models/User";
import dbConnect from "@/lib/database";
import bcrypt from "bcryptjs";

export const authOptions={
    secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user?.password
        );
        if (!isValid) return null;
        return {
          id: user?._id?.toString(),
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          age: user?.age,
          role: user?.role || "staff",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: '/error',
  },
  callbacks: {
    async jwt({ token,user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = (user as any).phone;
        token.age = (user as any).age;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (!session.user) session.user = {} as any;
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).email = token.email;
        (session.user as any).phone = token.phone;
        (session.user as any).age = token.age;
        session.user.role = token.role || "staff";
      }
      return session;
    },
  },
};

// const handler = NextAuth(authOptions);
//
// export default handler;
//
// export { handler as GET, handler as POST };
