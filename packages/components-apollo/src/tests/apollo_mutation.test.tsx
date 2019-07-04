import { JSONSchema, FormElement } from '@toryjs/form';

import { prepareComponent, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    people: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          sex: { type: 'string' }
        }
      }
    }
  }
};

const withFakeData = (data: string): FormElement[] => [
  {
    control: 'Stack',
    props: {
      layout: 'column',
      gap: '3px'
    },
    elements: [
      {
        control: 'ApolloMutation',
        props: {
          fakeData: data,
          clickHandler: 'mutate',
          mutation: `mutation Mutate {
          mutate {
            name
            sex
          }
        }`,
          target: 'people',
          loadingText: 'Loading ...'
        },
        elements: [
          {
            control: 'Button',
            props: {
              content: 'Mutate',
              onClick: 'mutate'
            }
          },
          {
            control: 'Repeater',
            props: { value: { source: 'people' } },
            elements: [
              {
                // edit template
                control: 'Stack',
                elements: [
                  {
                    control: 'Text',
                    props: { value: { source: 'name' } }
                  },
                  {
                    control: 'Text',
                    props: { value: ':\xa0' }
                  },
                  {
                    control: 'Text',
                    props: { value: { source: 'sex' } }
                  }
                ]
              },
              null,
              null
            ]
          }
        ]
      }
    ]
  }
];

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'Text',
      props: {
        value: 'Empty'
      }
    },
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false
      },
      elements: []
    },
    {
      control: 'Text',
      props: {
        value: 'Real Data'
      }
    },
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false,
        disable: false
      },
      elements: withFakeData(null)
    },
    {
      control: 'Text',
      props: {
        value: 'Fake Data'
      }
    },
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false,
        disable: false
      },
      elements: withFakeData(
        JSON.stringify({
          mutate: [
            { __typename: 'Person', name: 'Tomas', sex: 'Male' },
            { __typename: 'Person', name: 'Valeria', sex: 'Female' }
          ]
        })
      )
    }
  ]
});

const formData = {};

describe('Apollo', () => {
  describe('Mutation', () => {
    return {
      component: prepareComponent(formDefinition, schema, formData, { addEditor: true })
    };
  });
});
