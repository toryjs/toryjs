import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import {
  prop,
  propGroup,
  handlerProp,
  boundProp,
  dataProp,
  getValue,
  Context,
  createEditorContainer
} from '@toryjs/ui';

import gql from 'graphql-tag';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloQueryView, ApolloQueryProps, parseVariables } from './apollo_query_view';
import { observer } from 'mobx-react';

export const thumbnails = {
  light:
    'data:image/png;base64,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',
  dark:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjk2PC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45NjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAg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'
};

export const variables = {
  variables: prop({
    control: 'Table',
    documentation: 'List of constant query variables, e.g. <pre>{ sex: "female" }</pre>',
    props: { text: 'Variables - Constant', display: 'group' },
    elements: [
      {
        control: 'Input',
        props: { placeholder: 'Name', value: { source: 'name' }, label: 'Name' }
      },
      {
        control: 'Input',
        props: { placeholder: 'Value', label: 'Value', value: { source: 'value' } }
      },
      {
        control: 'Select',

        props: {
          label: 'Type',
          value: { source: 'type' },
          options: [
            { text: 'String', value: 'string' },
            { text: 'Number', value: 'number' },
            { text: 'Boolean', value: 'boolean' }
          ]
        }
      }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        value: { type: 'string' },
        type: { type: 'string' }
      }
    }
  }),
  boundVariables: prop({
    control: 'Table',
    documentation: 'List of query variables bound to your dataset',
    props: { text: 'Variables - Bound', display: 'group' },
    elements: [
      {
        control: 'Input',
        props: { placeholder: 'Name', label: 'Name', value: { source: 'name' } }
      },
      {
        control: 'Select',
        props: {
          options: { handler: 'datasetSource' },
          label: 'Source',
          value: { source: 'source' }
        }
      }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        source: { type: 'string' },
        value: { type: 'string' }
      }
    }
  })
};

export const handlerProps = propGroup('Handlers', {
  onResult: handlerProp({
    label: 'onResult',
    documentation: '<i>(data: any) => void: </i> executes when data is returned from data endpoint'
  }),
  onError: handlerProp({
    label: 'onError',
    documentation: '<i>(error: Error) => void: </i> executes when error occurs'
  }),
  onSubmit: handlerProp({
    label: 'onQuery',
    documentation:
      '<i>Handler:</i> executes before the query. It <b>must returns</b> the query variables.'
  })
});

const ApolloQueryEditorComponent = observer((props: FormComponentProps<ApolloQueryProps>) => {
  const controlProps = props.formElement.props;
  const context = React.useContext(Context);
  controlProps.query;

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
          query: gql([controlProps.query]),
          variables: parseVariables(props, context)
        },
        result: {
          data
        }
      }
    ];

    return (
      <MockedProvider mocks={mocks} addTypename={false}>
        <ApolloQueryView.Component {...props} />
      </MockedProvider>
    );
  }
  return <ApolloQueryView.Component {...props} />;
});

export const ApolloQueryEditor: EditorComponent = {
  Component: createEditorContainer(ApolloQueryEditorComponent),
  title: 'Apollo Query',
  control: 'ApolloQuery',
  thumbnail: thumbnails,
  provider: true,
  group: 'Data',
  props: {
    ...propGroup('Query', {
      query: prop({
        label: 'Query',
        documentation: 'GraphQL query, e.g. <pre>query People { name, sex }</pre>',
        control: 'Code',
        props: {
          display: 'topLabel',
          language: 'graphql'
        },
        type: 'string'
      }),
      target: dataProp({
        documentation:
          'Target dataset field, where you can (but do not have to) store the query result',
        label: 'Target'
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
      fakeData: boundProp({
        control: 'Code',
        props: { language: 'javascript', display: 'topLabel' },
        documentation: `Fake data to return from query. e.g. for query <i>people</i>
<pre>
{
  people: [
    { name: 'Tomas', sex: 'Male' },
    { name: 'Vittoria', sex: 'Female }
  ]
}
</pre>
`
      })
    })
  },
  defaultProps: {
    loadingText: 'Loading ...'
  }
};
