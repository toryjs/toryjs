import { EditorComponentCatalogue } from '@toryjs/form';
import { ApolloProviderEditor } from './apollo_provider_editor';
import { ApolloQueryEditor } from './apollo_query.editor';
import { ApolloMutationEditor } from './apollo_mutation_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  components: {
    ApolloProvider: ApolloProviderEditor,
    ApolloQuery: ApolloQueryEditor,
    ApolloMutation: ApolloMutationEditor
  },
  cssClass: ''
};
