import { gql } from 'apollo-server-micro'

export const mutations = gql`
    type Mutation {
        login(password: String): String
    }
`