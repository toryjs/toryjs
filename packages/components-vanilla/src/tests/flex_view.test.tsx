import { JSONSchema, FormElement } from '@toryjs/form';

import { create } from '@toryjs/ui';
import { prepareComponent, testStandard, testEditor } from './common';

function elements(): FormElement[] {
  return [
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 30px; background-color: red;` } }
    },
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 50px; background-color: blue;` } }
    },
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 20px; background-color: green;` } }
    },
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 20px; background-color: green;` } }
    },
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 20px; background-color: green;` } }
    },
    {
      control: 'Text',
      props: { value: '1', css: { value: `width: 100px; height: 20px; background-color: green;` } }
    }
  ];
}

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'Text',
      props: { value: 'Row Layout', control: 'Text' }
    },
    {
      control: 'Flex',
      props: {
        layout: 'row',
        gap: '0px',
        alignItems: 'center'
      },
      elements: elements()
    },
    {
      control: 'Flex',
      props: {
        layout: 'row',
        gap: '6px',
        justifyContent: 'space-around'
      },
      elements: elements()
    },
    {
      control: 'Text',
      props: { value: 'Column Layout', control: 'Text', css: { value: 'margin-top: 15px;' } }
    },
    {
      control: 'Flex',
      props: {
        layout: 'column',
        gap: '12px',
        control: 'Stack'
      },
      elements: elements()
    },
    {
      control: 'Flex',
      props: {
        layout: 'column',
        gap: '0px'
      },
      elements: elements()
    }
  ]
});

const formData = {};
const schema: JSONSchema = { type: 'object', properties: {} };

describe('Flex', () => {
  it('renders standard', () => {
    testStandard(formDefinition, schema, formData);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, formData);
  });

  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      showToolBox: true
    })
  };
});
