import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
