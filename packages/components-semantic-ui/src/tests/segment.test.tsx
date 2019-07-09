import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent, testStandard, testEditor, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    hide: {
      type: 'boolean'
    }
  }
};

const formDefinition: FormElement = create.stack({
  props: {
    gap: '12px',
    layout: 'column'
  },
  elements: [
    {
      control: 'Text',
      props: { value: 'Segments' }
    },
    {
      control: 'LinkSelector',
      props: { text: 'Hide', source: true, target: { source: 'hide' } }
    },
    {
      control: 'LinkSelector',
      props: { text: 'Show', source: false, target: { source: 'hide' } }
    },
    {
      props: { attached: 'top', hidden: { source: 'hide' }, name: 'A' },
      control: 'Segment',
      elements: [
        {
          control: 'Text',
          props: { value: 'SEGMENT A' }
        }
      ]
    },
    {
      props: { attached: 'top', name: 'B' },
      control: 'Segment',
      elements: [
        {
          control: 'Text',
          props: { value: 'SEGMENT B' }
        }
      ]
    },
    {
      props: { color: 'blue', inverted: true },
      control: 'Segment',
      elements: []
    }
  ]
});

const formData = {
  description: 'Some Description',
  hide: false
};

describe('Segment', () => {
  it('renders standard', () => {
    testStandard(formDefinition, schema, formData);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, formData);
  });

  return { component: prepareComponent(formDefinition, schema, formData, { addEditor: true }) };
});
