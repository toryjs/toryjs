import { JSONSchema, FormElement } from '@toryjs/form';

import { prepareComponent, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    fake: { type: 'string' },
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

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false,
        disable: true
      },
      elements: []
    },
    {
      control: 'ApolloProvider',
      props: {
        server: 'http://localhost:4000/graphql',
        auth: false
      },
      elements: [
        {
          control: 'Stack',
          props: {
            layout: 'column',
            gap: '3px'
          },
          elements: [
            {
              control: 'ApolloQuery',
              props: {
                query: `query People {
                people {
                  name
                  sex
                },
              }`,
                fakeData: { source: 'fake' },
                target: 'people',
                loadingText: 'Loading ...'
              },
              elements: [
                {
                  control: 'Repeater',
                  props: {
                    value: { source: 'people' }
                  },
                  elements: [
                    {
                      // edit template
                      control: 'Stack',
                      props: { layout: 'row' },
                      elements: [
                        {
                          control: 'Text',
                          props: {
                            value: { source: 'name' }
                          }
                        },
                        {
                          control: 'Text',
                          props: { value: ':\xa0' }
                        },
                        {
                          control: 'Text',
                          props: {
                            value: { source: 'sex' }
                          }
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
      ]
    }
  ]
});

const formData = {
  fake: JSON.stringify({
    people: [{ name: 'Tomas', sex: 'Male' }]
  })
};

describe('Apollo', () => {
  describe('Query', () => {
    return {
      component: prepareComponent(formDefinition, schema, formData, { addEditor: true })
      // apollo: {
      //   // mocked response for the query named PostsForAuthor
      //   People: {
      //     resolveWith: {
      //       people: [
      //         { __typename: 'Person', name: 'Tomas', sex: 'Male' },
      //         { __typename: 'Person', name: 'Valeria', sex: 'Female' }
      //       ]
      //     }
      //   }
      // }
    };
  });
});
