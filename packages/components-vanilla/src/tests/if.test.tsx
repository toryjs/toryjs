import { JSONSchema, FormElement } from '@toryjs/form';

import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    value: {
      type: 'boolean'
    }
  }
};

const formDefintion: FormElement = {
  control: 'Stack',
  props: {
    gap: '12px'
  },
  elements: [
    {
      control: 'If',
      props: {
        value: { source: 'value' },
        exists: true
      },
      elements: [
        {
          control: 'Text',
          props: { text: 'Is TRUE' }
        },
        {
          control: 'Text',
          props: { text: 'Is FALSE' }
        }
      ]
    },
    {
      control: 'If',
      props: {
        value: { source: 'value' },
        notExists: true
      },
      elements: [
        {
          control: 'Text',
          props: { text: 'Is TRUE' }
        },
        {
          control: 'Text',
          props: { text: 'Is FALSE' }
        }
      ]
    }
  ]
};

describe('If', () => {
  // it('renders correctly', () => {
  //   const comp = renderer.create(component());
  //   expect(comp).toMatchSnapshot();
  // });

  return {
    component: prepareComponent(
      formDefintion,
      schema,
      { value: true },
      {
        addEditor: true,
        showReadOnly: false
      }
    )
  };
});
