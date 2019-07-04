import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

const formDefinition: FormElement = {
  control: 'Form',
  elements: [
    {
      control: 'Menu',
      props: {
        inverted: true,
        color: 'blue'
      },
      elements: []
    },
    {
      control: 'Menu',
      props: {
        inverted: true,
        color: 'red',
        row: 1,
        column: 1
      },
      elements: [
        {
          control: 'MenuItem',
          props: { content: 'First', name: 'first', icon: 'doctor' }
        },
        {
          control: 'MenuItem',
          props: {}
        },
        {
          control: 'MenuItem',
          elements: [
            {
              control: 'Icon',
              props: { name: 'circle' }
            },
            {
              control: 'Text',
              props: { text: 'Children' }
            }
          ]
        }
      ]
    },
    {
      control: 'Text',
      props: {
        row: 2,
        column: 1,
        text: 'Pre-Selected'
      }
    },
    {
      control: 'Menu',
      props: {
        value: { source: 'name' },
        inverted: true,
        color: 'green',
        row: 3,
        column: 1
      },
      elements: [
        {
          control: 'MenuItem',
          props: { content: 'First', name: 'first' }
        },
        {
          control: 'MenuItem',
          props: { content: 'Second', name: 'second' }
        }
      ]
    }
  ]
};

const formData = {
  name: 'second'
};

describe('Menu', () => {
  describe('Standard', () => {
    // it('renders correctly', () => {
    //   const wrapper = renderer.create(component());
    //   expect(wrapper).toMatchSnapshot();
    // });

    return {
      component: prepareComponent(formDefinition, schema, formData, {
        showReadOnly: false,
        addEditor: true,
        showOutline: true
      })
    };
  });
});
