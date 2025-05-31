import { gql } from 'apollo-server-micro'

export const queries = gql`
	type Query {
		hello: String
		listLinks: [Link] # For authenticated user's dashboard
		listPublicLinks(userId: ID!): [Link] # For public user pages
		findLinkById(id: Int!): Link # For authenticated user's dashboard
		fetchOverview: [Overview] # For authenticated user's dashboard
	}
`