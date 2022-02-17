import { gql } from 'apollo-server-micro'

export const types = gql`
    type Link {
        id: Int!
        label: String
        content: String
        type: String!
        position: Int!
    }
    enum EVENT_TYPE {
        click
        view
    }
    type Event {
        id: Int!
        type: EVENT_TYPE!
        created_at: String!
        link_id: Int!
    }
    type Overview {
        views: Int!
        clicks: Int!
        date: String!
    }
`