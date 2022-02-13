import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Link = {
  __typename?: 'Link';
  content?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  label?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLink?: Maybe<Link>;
  deleteLinkById?: Maybe<Link>;
  login?: Maybe<Scalars['String']>;
  updateLinkById?: Maybe<Link>;
  verify?: Maybe<Scalars['String']>;
};


export type MutationCreateLinkArgs = {
  content?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};


export type MutationDeleteLinkByIdArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  password?: Maybe<Scalars['String']>;
};


export type MutationUpdateLinkByIdArgs = {
  content?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  label?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  type: Scalars['String'];
};


export type MutationVerifyArgs = {
  jwt?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  findLinkById?: Maybe<Link>;
  hello?: Maybe<Scalars['String']>;
  listLinks?: Maybe<Array<Maybe<Link>>>;
};


export type QueryFindLinkByIdArgs = {
  id: Scalars['Int'];
};

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type VerifyMutationVariables = Exact<{
  jwt: Scalars['String'];
}>;


export type VerifyMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verify'>
);

export type CreateLinkMutationVariables = Exact<{
  label?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  type: Scalars['String'];
}>;


export type CreateLinkMutation = (
  { __typename?: 'Mutation' }
  & { createLink?: Maybe<(
    { __typename?: 'Link' }
    & Pick<Link, 'id' | 'label' | 'content' | 'type' | 'position'>
  )> }
);

export type UpdateLinkByIdMutationVariables = Exact<{
  label?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  position: Scalars['Int'];
  type: Scalars['String'];
}>;


export type UpdateLinkByIdMutation = (
  { __typename?: 'Mutation' }
  & { updateLinkById?: Maybe<(
    { __typename?: 'Link' }
    & Pick<Link, 'id' | 'label' | 'content' | 'type' | 'position'>
  )> }
);

export type DeleteLinkByIdMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteLinkByIdMutation = (
  { __typename?: 'Mutation' }
  & { deleteLinkById?: Maybe<(
    { __typename?: 'Link' }
    & Pick<Link, 'id' | 'label' | 'content' | 'type' | 'position'>
  )> }
);

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type ListLinksQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLinksQuery = (
  { __typename?: 'Query' }
  & { listLinks?: Maybe<Array<Maybe<(
    { __typename?: 'Link' }
    & Pick<Link, 'id' | 'label' | 'content' | 'type' | 'position'>
  )>>> }
);

export type FindLinkByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindLinkByIdQuery = (
  { __typename?: 'Query' }
  & { findLinkById?: Maybe<(
    { __typename?: 'Link' }
    & Pick<Link, 'id' | 'label' | 'content' | 'type' | 'position'>
  )> }
);


export const LoginDocument = gql`
    mutation login($password: String!) {
  login(password: $password)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const VerifyDocument = gql`
    mutation verify($jwt: String!) {
  verify(jwt: $jwt)
}
    `;
export type VerifyMutationFn = Apollo.MutationFunction<VerifyMutation, VerifyMutationVariables>;

/**
 * __useVerifyMutation__
 *
 * To run a mutation, you first call `useVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyMutation, { data, loading, error }] = useVerifyMutation({
 *   variables: {
 *      jwt: // value for 'jwt'
 *   },
 * });
 */
export function useVerifyMutation(baseOptions?: Apollo.MutationHookOptions<VerifyMutation, VerifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyMutation, VerifyMutationVariables>(VerifyDocument, options);
      }
export type VerifyMutationHookResult = ReturnType<typeof useVerifyMutation>;
export type VerifyMutationResult = Apollo.MutationResult<VerifyMutation>;
export type VerifyMutationOptions = Apollo.BaseMutationOptions<VerifyMutation, VerifyMutationVariables>;
export const CreateLinkDocument = gql`
    mutation createLink($label: String, $content: String, $type: String!) {
  createLink(label: $label, content: $content, type: $type) {
    id
    label
    content
    type
    position
  }
}
    `;
export type CreateLinkMutationFn = Apollo.MutationFunction<CreateLinkMutation, CreateLinkMutationVariables>;

/**
 * __useCreateLinkMutation__
 *
 * To run a mutation, you first call `useCreateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLinkMutation, { data, loading, error }] = useCreateLinkMutation({
 *   variables: {
 *      label: // value for 'label'
 *      content: // value for 'content'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreateLinkMutation(baseOptions?: Apollo.MutationHookOptions<CreateLinkMutation, CreateLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLinkMutation, CreateLinkMutationVariables>(CreateLinkDocument, options);
      }
export type CreateLinkMutationHookResult = ReturnType<typeof useCreateLinkMutation>;
export type CreateLinkMutationResult = Apollo.MutationResult<CreateLinkMutation>;
export type CreateLinkMutationOptions = Apollo.BaseMutationOptions<CreateLinkMutation, CreateLinkMutationVariables>;
export const UpdateLinkByIdDocument = gql`
    mutation updateLinkById($label: String, $content: String, $id: Int!, $position: Int!, $type: String!) {
  updateLinkById(
    label: $label
    content: $content
    id: $id
    position: $position
    type: $type
  ) {
    id
    label
    content
    type
    position
  }
}
    `;
export type UpdateLinkByIdMutationFn = Apollo.MutationFunction<UpdateLinkByIdMutation, UpdateLinkByIdMutationVariables>;

/**
 * __useUpdateLinkByIdMutation__
 *
 * To run a mutation, you first call `useUpdateLinkByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLinkByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLinkByIdMutation, { data, loading, error }] = useUpdateLinkByIdMutation({
 *   variables: {
 *      label: // value for 'label'
 *      content: // value for 'content'
 *      id: // value for 'id'
 *      position: // value for 'position'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useUpdateLinkByIdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLinkByIdMutation, UpdateLinkByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLinkByIdMutation, UpdateLinkByIdMutationVariables>(UpdateLinkByIdDocument, options);
      }
export type UpdateLinkByIdMutationHookResult = ReturnType<typeof useUpdateLinkByIdMutation>;
export type UpdateLinkByIdMutationResult = Apollo.MutationResult<UpdateLinkByIdMutation>;
export type UpdateLinkByIdMutationOptions = Apollo.BaseMutationOptions<UpdateLinkByIdMutation, UpdateLinkByIdMutationVariables>;
export const DeleteLinkByIdDocument = gql`
    mutation deleteLinkById($id: Int!) {
  deleteLinkById(id: $id) {
    id
    label
    content
    type
    position
  }
}
    `;
export type DeleteLinkByIdMutationFn = Apollo.MutationFunction<DeleteLinkByIdMutation, DeleteLinkByIdMutationVariables>;

/**
 * __useDeleteLinkByIdMutation__
 *
 * To run a mutation, you first call `useDeleteLinkByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLinkByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLinkByIdMutation, { data, loading, error }] = useDeleteLinkByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLinkByIdMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLinkByIdMutation, DeleteLinkByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLinkByIdMutation, DeleteLinkByIdMutationVariables>(DeleteLinkByIdDocument, options);
      }
export type DeleteLinkByIdMutationHookResult = ReturnType<typeof useDeleteLinkByIdMutation>;
export type DeleteLinkByIdMutationResult = Apollo.MutationResult<DeleteLinkByIdMutation>;
export type DeleteLinkByIdMutationOptions = Apollo.BaseMutationOptions<DeleteLinkByIdMutation, DeleteLinkByIdMutationVariables>;
export const HelloDocument = gql`
    query hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const ListLinksDocument = gql`
    query listLinks {
  listLinks {
    id
    label
    content
    type
    position
  }
}
    `;

/**
 * __useListLinksQuery__
 *
 * To run a query within a React component, call `useListLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListLinksQuery({
 *   variables: {
 *   },
 * });
 */
export function useListLinksQuery(baseOptions?: Apollo.QueryHookOptions<ListLinksQuery, ListLinksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListLinksQuery, ListLinksQueryVariables>(ListLinksDocument, options);
      }
export function useListLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListLinksQuery, ListLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListLinksQuery, ListLinksQueryVariables>(ListLinksDocument, options);
        }
export type ListLinksQueryHookResult = ReturnType<typeof useListLinksQuery>;
export type ListLinksLazyQueryHookResult = ReturnType<typeof useListLinksLazyQuery>;
export type ListLinksQueryResult = Apollo.QueryResult<ListLinksQuery, ListLinksQueryVariables>;
export const FindLinkByIdDocument = gql`
    query findLinkById($id: Int!) {
  findLinkById(id: $id) {
    id
    label
    content
    type
    position
  }
}
    `;

/**
 * __useFindLinkByIdQuery__
 *
 * To run a query within a React component, call `useFindLinkByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindLinkByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindLinkByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFindLinkByIdQuery(baseOptions: Apollo.QueryHookOptions<FindLinkByIdQuery, FindLinkByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindLinkByIdQuery, FindLinkByIdQueryVariables>(FindLinkByIdDocument, options);
      }
export function useFindLinkByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindLinkByIdQuery, FindLinkByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindLinkByIdQuery, FindLinkByIdQueryVariables>(FindLinkByIdDocument, options);
        }
export type FindLinkByIdQueryHookResult = ReturnType<typeof useFindLinkByIdQuery>;
export type FindLinkByIdLazyQueryHookResult = ReturnType<typeof useFindLinkByIdLazyQuery>;
export type FindLinkByIdQueryResult = Apollo.QueryResult<FindLinkByIdQuery, FindLinkByIdQueryVariables>;