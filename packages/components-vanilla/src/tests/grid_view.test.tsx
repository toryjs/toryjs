import { JSONSchema, FormElement } from '@toryjs/form';
import { create } from '@toryjs/test-support';

import { prepareComponent, testStandard, testEditor } from './common';

function elements(): FormElement[] {
  return [
    {
      control: 'Text',
      props: {
        value: '1',
        row: 1,
        column: 1,
        width: 2,
        css: `width: 100%; height: 30px; background-color: red;`
      }
    },
    {
      control: 'Text',
      props: {
        value: '1',
        row: 1,
        column: 4,
        width: 1,
        css: `width: 100%; height: 50px; background-color: blue;`
      }
    },
    {
      control: 'Text',
      props: {
        value: '1',
        row: 2,
        column: 2,
        width: 2,
        css: `width: 100%; height: 20px; background-color: green;`
      }
    },
    {
      control: 'Text',
      props: {
        value: '1',
        row: 4,
        column: 1,
        width: 1,
        css: `width: 100%; height: 20px; background-color: green;`
      }
    },
    {
      control: 'Text',
      props: {
        value: '1',
        row: 4,
        column: 4,
        width: 1,
        css: `width: 100%; height: 20px; background-color: green;`
      }
    }
  ];
}

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'Text',
      props: { value: 'Empty Grid', control: 'Text' }
    },
    {
      control: 'Grid',
      props: {
        rows: 1,
        columns: 4
      },
      elements: []
    },
    {
      control: 'Text',
      props: { value: 'With Elements', control: 'Text', css: 'margin-top: 15px;' }
    },
    {
      control: 'Grid',
      props: {
        rows: { value: 8 },
        columns: 4,
        control: 'Grid'
      },
      elements: elements()
    }
  ]
});

const formData = {};
const schema: JSONSchema = { type: 'object', properties: {} };

describe('Grid', () => {
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
