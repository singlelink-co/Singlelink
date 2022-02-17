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

export enum Event_Type {
  Click = 'click',
  View = 'view'
}

export type Event = {
  __typename?: 'Event';
  created_at: Scalars['String'];
  id: Scalars['Int'];
  link_id: Scalars['Int'];
  type: Event_Type;
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
  createEvent?: Maybe<Event>;
  createLink?: Maybe<Link>;
  deleteLinkById?: Maybe<Link>;
  login?: Maybe<Scalars['String']>;
  reorderLink?: Maybe<Array<Maybe<Link>>>;
  updateLinkById?: Maybe<Link>;
  verify?: Maybe<Scalars['String']>;
};


export type MutationCreateEventArgs = {
  type?: Maybe<Event_Type>;
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


export type MutationReorderLinkArgs = {
  id: Scalars['Int'];
  newIndex: Scalars['Int'];
  oldIndex: Scalars['Int'];
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

export type Overview = {
  __typename?: 'Overview';
  clicks: Scalars['Int'];
  date: Scalars['String'];
  views: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  fetchOverview?: Maybe<Array<Maybe<Overview>>>;
  findLinkById?: Maybe<Link>;
  hello?: Maybe<Scalars['String']>;
  listLinks?: Maybe<Array<Maybe<Link>>>;
};


export type QueryFindLinkByIdArgs = {
  id: Scalars['Int'];
};
