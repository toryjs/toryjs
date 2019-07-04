import { create } from '@toryjs/ui';
import { JSONSchema } from '@toryjs/form';
import { prepareComponent, testStandard, testEditor } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string'
    }
  },
  required: ['name']
};

const formDefinition = create.stack({
  elements: [
    {
      props: {
        label: 'Description',
        icon: 'doctor',
        color: 'red',
        content: { source: 'description' }
      },
      control: 'Comment'
    },
    {
      props: {
        label: 'Description',
        icon: 'comment outline',
        color: 'yellow',
        content: 'Direct description',
        header: 'This is header'
      },
      control: 'Comment'
    }
  ]
});

const data = {
  description: 'Some Description'
};

describe('Comment', () => {
  it('renders standard', () => {
    testStandard(formDefinition, schema, data);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, data);
  });

  return {
    component: prepareComponent(formDefinition, schema, data, {
      addEditor: true,
      showToolBox: false,
      showStandard: true,
      validate: true
    })
  };
});
