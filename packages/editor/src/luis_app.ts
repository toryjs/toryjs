import { renderLuis } from 'luis';

if (!global.process) {
  (global as any).process = { env: { NODE_ENV: 'development' } };
}

import { createRouterProxy } from 'luis/proxies/react-router';
import { createApolloProxy } from 'luis/proxies/apollo';

import { ProxyStore } from 'luis/client/models/proxy_store';

export const ApolloProxy = createApolloProxy({
  endpoint: 'http://localhost:4000/graphql'
});

const RouterProxy = { proxy: createRouterProxy(), key: 'router' };

ProxyStore.init([ApolloProxy, RouterProxy]);

renderLuis({
  // ...require('./summary'),
  // loadTests: () => require('**.test')
  loadTests: () => {
    require('**.test');
  }
});
