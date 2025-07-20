import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/lib/models/User';
import dbConnect from '@/lib/database';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login', 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = (user as any).phone;
        token.age = (user as any).age;
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
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 