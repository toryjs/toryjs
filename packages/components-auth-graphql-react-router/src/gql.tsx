import * as React from 'react';

import * as ReactApollo from 'react-apollo';
import gql from 'graphql-tag';

type Maybe<T> = T | null;

/* =========================================================
    Login
   ======================================================== */

export const LoginMutationDocument = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export type LoginMutationVariables = {
  email: string;
  password: string;
};

export type LoginMutationMutation = {
  __typename?: 'Mutation';

  login: Maybe<LoginMutationLogin>;
};

export type LoginMutationLogin = {
  __typename?: 'AuthPayload';

  token: Maybe<string>;
};

export class LoginMutationComponent extends React.Component<
  Partial<ReactApollo.MutationProps<LoginMutationMutation, LoginMutationVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<LoginMutationMutation, LoginMutationVariables>
        mutation={LoginMutationDocument}
        {...(this as any)['props'] as any}
      />
    );
  }
}

/* =========================================================
    Resume
   ======================================================== */

export type ResumeQueryVariables = {
  token: string;
};

export type ResumeQueryQuery = {
  __typename?: 'Mutation';

  resume: Maybe<ResumeMutationResume>;
};

export type ResumeMutationResume = {
  __typename?: 'AuthPayload';

  token: Maybe<string>;

  user: Maybe<ResumeMutationUser>;
};

export type ResumeMutationUser = {
  __typename?: 'User';

  email: string;

  id: string;

  roles: Maybe<(Maybe<string>)[]>;

  user: string;
};

export const ResumeQueryDocument = gql`
  query ResumeQuery($token: String!) {
    resume(token: $token) {
      token
      user {
        email
        id
        roles
        user
      }
    }
  }
`;
export class ResumeQueryComponent extends React.Component<
  Partial<ReactApollo.QueryProps<ResumeQueryQuery, ResumeQueryVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<ResumeQueryQuery, ResumeQueryVariables>
        query={ResumeQueryDocument}
        {...(this as any)['props'] as any}
      />
    );
  }
}

/* =========================================================
  Signup
  ======================================================== */

export type SignupMutationVariables = {
  email: string;
  password: string;
  name: string;
};

export type SignupMutationMutation = {
  __typename?: 'Mutation';

  signup: Maybe<SignupMutationSignup>;
};

export type SignupMutationSignup = {
  __typename?: 'AuthPayload';

  token: Maybe<string>;
};

export const SignupMutationDocument = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;
export class SignupMutationComponent extends React.Component<
  Partial<ReactApollo.MutationProps<SignupMutationMutation, SignupMutationVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<SignupMutationMutation, SignupMutationVariables>
        mutation={SignupMutationDocument}
        {...(this as any)['props'] as any}
      />
    );
  }
}
