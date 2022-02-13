import { gql } from 'apollo-server-micro'

export const types = gql`
    type Link {
        id: Int!
        label: String
        content: String
        type: String!
        position: Int!
    }
`