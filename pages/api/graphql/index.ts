// Import third-party dependencies
import { ApolloServer, gql } from 'apollo-server-micro'
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
const cors = require('micro-cors')(); // highlight-line
const { send } = require('micro');


// Import first-party dependencies
import { Mutation } from './mutations';
import { Query } from './queries';
// import { Resolvers } from './resolvers'; // Assuming individual resolvers are imported in mutations/queries
import { typeDefs } from './type-defs';
import { unstable_getServerSession } from 'next-auth/next'; // For server-side session access
import { authOptions } from '../auth/[...nextauth]'; // Import authOptions from your NextAuth config

export const resolvers = {
    Mutation,
    Query,
    //...Resolvers // If you have other top-level resolvers, ensure they are correctly aggregated
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
        // Use unstable_getServerSession to get the session
        const session = await unstable_getServerSession(req, res, authOptions as any); // Cast to any if authOptions type causes issues

        // The old JWT verification logic can be removed if NextAuth session is the source of truth
        // if(req.headers.authorization) {
        //     const token = req.headers.authorization.substr(7, req.headers.authorization.length-7) || ''
        //     try {
        //         const decoded = jwt.verify(token, process.env.SECRET)
        //     } catch {
        //         // return { isAuthorized: false} // Old context
        //     }
        //     // return { isAuthorized: true } // Old context
        // }

        // Return the session in the context, making it available to resolvers
        // Also include isAuthorized or similar based on session existence if needed by resolvers
        return {
          session,
          isAuthorized: !!session // True if session exists, false otherwise
          // You can add other context properties here, like a database connection pool
        };
    }
});

const startServer = server.start();

export const config = {
    api: {
        bodyParser: false
    }
}

export default cors(async(req: MicroRequest, res: ServerResponse) => {
    if (req.method === "OPTIONS") {
        res.end();
        return false;
      }
    
      await startServer;
      await server.createHandler({ path: "/api/graphql" })(req, res);
})