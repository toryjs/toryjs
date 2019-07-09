import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string'
    },
    empty: {
      type: 'string'
    }
  },
  required: ['name']
};

const formDefinition: FormElement = create.stack({
  elements: [
    {
      props: {
        label: 'Description',
        value: { source: 'description' }
      },
      control: 'Textarea'
    },
    {
      control: 'Textarea',
      props: {
        placeholder: 'Render me!',
        label: 'Description',
        source: { value: 'empty' }
      }
    }
  ]
});

const formData = {
  description: 'Some Description'
};

describe('Text Area', () => {
  // it('renders tab menu', () => {
  //   const wrapper = renderer.create(component());
  //   expect(wrapper).toMatchSnapshot();
  // });

  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      showStandard: true
    })
  };
});
