// Import third-party dependencies
import { ApolloServer, gql } from 'apollo-server-micro'
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
const cors = require('micro-cors')(); // highlight-line
const { send } = require('micro');


// Import first-party dependencies
import { Mutation } from './mutations'
import { Query } from './queries'
import { Resolvers } from './resolvers'
import { typeDefs } from './type-defs'
const jwt = require('jsonwebtoken')

export const resolvers = {
    Mutation,
    Query,
    //...Resolvers
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        if(req.headers.authorization) {
            const token = req.headers.authorization.substr(7, req.headers.authorization.length-7) || ''
            try {
                const decoded = jwt.verify(token, process.env.SECRET)
            } catch {
                return { isAuthorized: false}
            }
            return { isAuthorized: true }
        } else return {}
    }
})

const startServer = server.start()

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