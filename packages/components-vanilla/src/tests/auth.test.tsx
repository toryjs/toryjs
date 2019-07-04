import { JSONSchema, FormElement } from '@toryjs/form';
import { create } from '@toryjs/ui';

import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object'
};

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false
      },
      elements: [
        {
          control: 'AuthItem',
          elements: []
        },
        {
          control: 'AuthItem',
          elements: [
            {
              control: 'Text',
              props: { text: 'Authorised' }
            }
          ]
        },
        {
          control: 'AuthItem',
          props: { roles: ['admin'] },
          elements: [
            {
              control: 'Text',
              props: { text: 'Admin Only' }
            }
          ]
        }
      ]
    }
  ]
});

const formData = {};

describe('Auth', () => {
  return {
    component: prepareComponent(formDefinition, schema, formData, { addEditor: true })
  };
});
