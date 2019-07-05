import React from 'react';

import { EditorComponent, FormComponentProps } from '@toryjs/form';
import {
  propGroup,
  prop,
  Context,
  DynamicComponent,
  handlerProp,
  createEditorContainer
} from '@toryjs/ui';

import { ApolloProvider, ApolloProps } from './apollo_provider_view';
import { thumbnails } from './apollo_query.editor';

// const Provider = (props: any) => (
//   <div onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
//     <ApolloProvider {...props} />
//   </div>
// );

export const ApolloProviderEditorComponent: React.FC<FormComponentProps<ApolloProps>> = props => {
  const controlProps = props.formElement.props;
  const context = React.useContext(Context);

  if (controlProps.authorised) {
    context.auth.user = {
      roles: controlProps.roles.split(','),
      name: controlProps.user,
      id: controlProps.id
    };
  }

  return <DynamicComponent {...props} control={ApolloProvider} preserveProps={true} />;
};

ApolloProviderEditorComponent.displayName = 'ApolloProviderEditor';

export const ApolloProviderEditor: EditorComponent = {
  Component: createEditorContainer(ApolloProviderEditorComponent),
  title: 'Apollo Provider',
  control: 'ApolloProvider',
  thumbnail: thumbnails,
  provider: true,
  group: 'Data',
  props: {
    ...propGroup('Apollo', {
      server: prop({
        label: 'Server Url',
        type: 'string',
        documentation: 'Url of the GraphQL end point, e.g. https://graphql.org/swapi-graphql/'
      }),
      tokenName: prop({
        label: 'Token',
        type: 'string',
        documentation:
          'Specifies, under what name is the authorisation token stored in the local storage.'
      }),
      auth: prop({
        label: 'Use Authentication',
        control: 'Checkbox',
        type: 'boolean',
        documentation: 'Enables token base Authentication'
      }),
      batchRequests: prop({
        control: 'Checkbox',
        type: 'boolean',
        documentation:
          'Enables the ability to batch requests. When selected, make sure to install <pre>apollo-link-batch-http</pre>otherwise install <pre>apollo-link-http<pre>'
      }),
      configureClient: handlerProp({
        documentation:
          '<i>returns: ApolloClient</i>. When this handler is defined the client <b>must be configured manually</b>'
      })
      // disable: prop({
      //   documentation: 'This is useful during testing when a mocked provider can be used instead.',
      //   label: 'Disable provider',
      //   group: 'Apollo',
      //   control: 'Checkbox',
      //   type: 'boolean'
      // })
    }),
    ...propGroup('Editor', {
      authorised: prop({
        label: 'Authorise',
        control: 'Checkbox',
        type: 'boolean',
        documentation: 'Overrides the authorisation. <i>Runs only in development mode</i>'
      }),
      user: prop({
        label: 'User',
        type: 'string',
        documentation:
          'Overrides the currently logged in user. <i>Runs only in development mode</i>'
      }),
      roles: prop({
        label: 'Roles',
        type: 'string',
        documentation:
          'Overrides the roles of the currently logged in user. <i>Runs only in development mode</i>'
      }),
      id: prop({
        label: 'Id',
        type: 'string',
        documentation:
          'Overrides the id of the currentl logged in user. <i>Runs only in development mode</i>'
      })
    })
  }
};
