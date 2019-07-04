import * as React from 'react';

import { FormComponentProps, FormComponent } from '@toryjs/form';
import { createComponents, Context, simpleHandle } from '@toryjs/ui';

import { ApolloProvider as Provider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

export type ApolloProps = {
  server: string;
  auth: string;
  tokenName: string;
  batchRequests: boolean;
  disable: boolean;
  authorised?: boolean;
  user?: string;
  roles?: string;
  id?: string;
  configureClient?: string;
};

export const ApolloProvider: React.FC<FormComponentProps<ApolloProps>> = props => {
  const context = React.useContext(Context);
  const {
    formElement: {
      props: { auth, server, tokenName, batchRequests, disable, configureClient }
    }
  } = props;

  if (disable) {
    return <>{createComponents(props)}</>;
  }

  let client: ApolloClient<any>;

  if (configureClient) {
    client = simpleHandle(props, configureClient, context);
  } else {
    let httpLink;

    if (batchRequests) {
      let { BatchHttpLink } = require('apollo-link-batch-http');
      httpLink = new BatchHttpLink({ uri: server });
    } else {
      httpLink = require('apollo-link-http').createHttpLink({
        uri: server
      });
    }

    if (auth) {
      const { setContext } = require('apollo-link-context');
      const authLink = setContext((_: any, { headers }: any) => {
        const token = localStorage.getItem(tokenName || 'CORPIX_TOKEN');
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
          }
        };
      });
      client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
      });
    } else {
      client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache()
      });
    }
  }

  context.providers.client = client;

  return <Provider client={client}>{createComponents(props)}</Provider>;
};

export const ApolloProviderView: FormComponent = {
  Component: ApolloProvider
};