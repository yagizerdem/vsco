import Database from "@/lib/Database";
import User from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
const { v4: uuidv4 } = require("uuid");

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const db = new Database();
        try {
          await db.open();
          const email = req.body.email;
          const password = req.body.password;
          const userFromDb = await db.findOne(User, { email: email });
          if (!userFromDb) return null;

          const isPasswordMatch = await bcrypt.compare(
            password,
            userFromDb?.password
          );
          if (!isPasswordMatch) return null;

          return userFromDb;
        } catch (err) {
          console.log(err);
          return null;
        } finally {
          await db.close();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userData = {
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          id: user._id,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.userData;
      return session;
    },
  },
};

export default NextAuth(authOptions);
