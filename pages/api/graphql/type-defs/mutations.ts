import { gql } from 'apollo-server-micro'

export const mutations = gql`
    type Mutation {
        createLink(
            label: String
            content: String
            type: String!
        ): Link
        updateLinkById(
            label: String
            content: String
            id: Int!
            position: Int!
            type: String!
        ): Link
        deleteLinkById(id: Int!): Link
        reorderLink(id: Int!, newIndex: Int!, oldIndex: Int!): [Link]
        createEvent(type: EVENT_TYPE!, link_id: Int, user_id_on_public_page: ID): Event
    }
`