import { FormComponentCatalogue } from '@toryjs/form';
import { ApolloProviderView } from './apollo_provider_view';
import { ApolloQueryView } from './apollo_query_view';
import { ApolloMutation } from './apollo_mutation_view';

export const catalogue: FormComponentCatalogue = {
  components: {
    ApolloProvider: ApolloProviderView,
    ApolloQuery: ApolloQueryView,
    ApolloMutation: ApolloMutation
  },
  cssClass: ''
};
