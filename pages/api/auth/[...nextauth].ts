import NextAuth, { User, Session, JWT } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../../../lib/db' // Adjust path as necessary

// import { MySQLAdapter } from "@next-auth/mysql-adapter" // Placeholder for adapter

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter an email and password.");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("No user found with this email.");
        }

        const isValid = bcrypt.compareSync(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // Return user object without the password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user', // Use role from DB, default to 'user' if somehow null/undefined
          subscription_plan: user.subscription_plan || 'free', // Ensure subscription_plan is included
        };
      }
    })
    // ...add more providers here
  ],
  // adapter: MySQLAdapter({ // Placeholder for adapter configuration
  //   db: {
  //     host: process.env.DB_HOST,
  //     port: Number(process.env.DB_PORT),
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_DATABASE,
  //   }
  // }),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login', // Custom login page, to be created or updated
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | any }) { // user can be AdapterUser or User
      // Persist the user id, role and subscription_plan to the token right after signin
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.subscription_plan = user.subscription_plan || 'free';
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT; user: User | any }) {
      // Send properties to the client, like an access_token from a provider.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.subscription_plan = token.subscription_plan as string;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
