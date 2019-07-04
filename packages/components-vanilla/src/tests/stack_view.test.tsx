import { JSONSchema, FormElement } from '@toryjs/form';

import { prepareComponent, testStandard, testEditor, create } from './common';

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
      props: { value: 'Empty', control: 'Text' }
    },
    {
      control: 'Stack',
      props: {
        gap: '12px',
        layout: 'column'
      },
      elements: []
    },
    {
      control: 'Text',
      props: { value: 'Row Layout', control: 'Text' }
    },
    {
      control: 'Stack',
      props: {
        layout: 'row',
        gap: '0px'
      },
      elements: elements()
    },
    {
      control: 'Stack',
      props: {
        layout: 'row',
        gap: '6px'
      },
      elements: elements()
    },
    {
      control: 'Text',
      props: {
        value: 'Column Layout',
        control: 'Text',
        row: 3,
        column: 1,
        css: { value: 'margin-top: 15px;' }
      }
    },
    {
      control: 'Stack',
      props: {
        layout: 'column',
        gap: '12px',
        control: 'Stack'
      },
      elements: elements()
    },
    {
      control: 'Stack',
      props: {
        layout: 'column',
        gap: '0px',
        row: 5,
        column: 1
      },
      elements: elements()
    }
  ]
});

const formData = {};
const schema: JSONSchema = { type: 'object', properties: {} };

describe('Stack', () => {
  // it('renders correctly', () => {
  //   const wrapper = renderer.create(component());
  //   expect(wrapper).toMatchSnapshot();
  // });

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
