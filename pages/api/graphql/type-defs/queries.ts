import { gql } from 'apollo-server-micro'

export const queries = gql`
	type Query {
		hello: String
		listLinks: [Link]
		findLinkById(id: Int!): Link
	}
`