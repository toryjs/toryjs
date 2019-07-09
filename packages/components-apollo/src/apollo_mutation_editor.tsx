import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { prop, propGroup, Context, getValue, createEditorContainer } from '@toryjs/ui';
import { observer } from 'mobx-react';
import { thumbnails, variables, handlerProps } from './apollo_query.editor';
import { ApolloMutationView, ApolloMutationProps } from './apollo_mutation_view';

import gql from 'graphql-tag';
import { MockedProvider } from 'react-apollo/test-utils';
import { parseVariables } from './apollo_query_view';

const ApolloMutationEditorComponent = observer((props: FormComponentProps<ApolloMutationProps>) => {
  const controlProps = props.formElement.props;
  const context = React.useContext(Context);

  const handler = getValue(props, context, 'clickHandler');
  if (context.editor.projectHandlers.indexOf(handler) === -1) {
    context.editor.projectHandlers.push(handler);
  }

  controlProps.mutation;

  let fakeData = getValue(props, context, 'fakeData');
  if (fakeData) {
    let data: any;
    try {
      data = eval(`(${fakeData.trim()})`);
    } catch (ex) {
      return <div>Error parsing json: {ex.message}</div>;
    }

    const mocks = [
      {
        request: {
          query: gql([controlProps.mutation]),
          variables: parseVariables(props, context)
        },
        result: {
          data
        }
      }
    ];

    return (
      <MockedProvider mocks={mocks} addTypename={false}>
        <ApolloMutationView.Component {...props} />
      </MockedProvider>
    );
  }
  return <ApolloMutationView.Component {...props} />;
});

export const ApolloMutationEditor: EditorComponent = {
  Component: createEditorContainer(ApolloMutationEditorComponent),
  title: 'Apollo Mutation',
  control: 'ApolloMutation',
  thumbnail: thumbnails,
  provider: true,
  group: 'Data',
  handlers: {
    newHandler({ owner, context, args: { current, previous } }) {
      context.projectHandlers.remove(previous);
      if (context.projectHandlers.some((s: string) => s === current)) {
        owner.setError('clickHandler', `Handler "${current}" exists`);
        return null;
      } else {
        context.projectHandlers.push(current);
      }
      owner.setError('clickHandler', '');
      owner.setValue('clickHandler', current);

      return current;
    }
  },
  props: {
    ...propGroup('Mutation', {
      mutation: prop({
        control: 'Code',
        props: {
          language: 'graphql'
        },
        type: 'string',
        documentation: 'The graphql mutation'
      })
    }),
    ...propGroup('Options', {
      target: prop({
        control: 'Select',
        documentation:
          'Target dataset field, where you can (but do not have to) store the query result',
        props: {
          options: { handler: 'datasetSource' }
        }
      }),
      clickHandler: prop({
        documentation:
          'Name of the handler that submits this mutation. You can use this handler in other component, for example as <i>onClick</> handler of a button.',
        props: {
          value: {
            source: 'clickHandler',
            parse: 'newHandler'
          }
        }
      }),
      successAlert: prop({
        documentation: 'Displays an alert after successful mutation. Requires "AlertProvider"'
      }),
      errorAlert: prop({
        documentation: 'Displays an alert after failed mutation. Requires "AlertProvider"'
      }),
      loadingText: prop({
        props: { value: { source: 'loadingText' } },
        type: 'string',
        documentation: 'Display this text during query load'
      })
    }),
    ...variables,
    ...handlerProps,
    ...propGroup('Editor', {
      fakeData: prop({
        control: 'Code',
        props: { language: 'javascript' },
        documentation: `Fake data to return from the mutation.`
      })
    })
  },
  defaultProps: {
    loadingText: 'Loading ...'
  }
};
