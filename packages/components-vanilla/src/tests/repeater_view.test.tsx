import { JSONSchema, FormElement } from '@toryjs/form';
import { create } from '@toryjs/ui';

import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    countries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          capital: {
            type: 'string'
          }
        }
      }
    }
  }
};

const controlData = {
  countries: [
    { name: 'Slovakia', capital: 'Bratislava' },
    { name: 'Australia', capital: 'Canberra' }
  ]
};

const editorTemplate: FormElement = {
  control: 'Grid',
  props: {
    rows: 1,
    templateColumns: `1fr 1fr auto`,
    templateColumnsReadOnly: `1fr 1fr`,
    gap: '24px'
  },
  elements: [
    {
      props: { row: 1, column: 1, value: { source: 'name' }, label: 'Name' },
      control: 'Input'
    },
    {
      props: { row: 1, column: 2, value: { source: 'capital' }, label: 'Capital' },
      control: 'Input'
    },
    {
      props: { row: 1, column: 3, onClick: 'deleteRow' },
      control: 'Button'
    }
  ]
};

const addTemplate: FormElement = {
  control: 'Grid',
  props: {
    rows: 1,
    templateColumns: `1fr auto`,
    templateColumnsReadOnly: `1fr 1fr`,
    gap: '24px'
  },
  elements: [
    {
      props: {
        row: 1,
        column: 1,
        placeholder: { value: 'Add row' },
        value: { source: 'name' },
        label: 'Name'
      },
      control: 'Input'
    },
    {
      props: {
        row: 1,
        column: 2,
        content: { value: 'Add' },

        formAlign: true,
        color: { value: 'blue' },
        onClick: 'addRow'
      },
      control: 'Button'
    }
  ]
};

const viewTemplate: FormElement = {
  control: 'Grid',
  props: {
    rows: 1,
    templateColumns: `1fr 1fr auto`,
    gap: '24px'
  },
  elements: [
    {
      props: { row: 1, column: 1, value: { source: 'name' }, label: 'Name' },
      control: 'Value'
    },
    {
      props: { row: 1, column: 2, value: { source: 'capital' }, label: 'Capital' },
      control: 'Value'
    },
    {
      props: { row: 1, column: 3, content: { value: 'Edit' }, onClick: 'editRow' },
      control: 'Button'
    }
  ]
};

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'Text',
      props: { text: 'Unbound', css: 'font-size: 18px; font-weight: bold; background-color: #ccc;' }
    },
    {
      control: 'Repeater',
      elements: []
    },
    {
      control: 'Text',
      props: { text: 'Full', css: 'font-size: 18px; font-weight: bold; background-color: #ccc;' }
    },
    {
      props: { allowEdit: true, allowAdd: true, value: { source: 'countries' } },
      control: 'Repeater',
      elements: [viewTemplate, editorTemplate, addTemplate]
    },
    {
      control: 'Text',
      props: {
        text: 'Editor And View',
        css: 'font-size: 18px; font-weight: bold; background-color: #ccc;'
      }
    },
    {
      control: 'Repeater',
      props: { allowEdit: true, allowAdd: false, value: { source: 'countries' } },
      elements: [viewTemplate, editorTemplate]
    },
    {
      control: 'Text',
      props: {
        text: 'View Only',
        css: 'font-size: 18px; font-weight: bold; background-color: #ccc;'
      }
    },
    {
      control: 'Repeater',
      props: { value: { source: 'countries' } },
      elements: [viewTemplate]
    }
  ]
});

describe('Repeater', () => {
  // it('renders correctly', () => {
  //   const comp = renderer.create(component());
  //   expect(comp).toMatchSnapshot();
  // });

  return {
    component: prepareComponent(formDefinition, schema, controlData, {
      addEditor: true,
      showStandard: true,
      showReadOnly: false
    })
  };

  // it('changes value and all related formulas', () => {
  //   // const wrapper = renderer.create(data.component);
  //   // const root = component.root;
  //   // const agree = root.findByProps({ name: 'agree' });
  //   // agree.props.onChange(null, { value: false });
  //   // const disagree = root.findByProps({ name: 'disagree' });
  //   // disagree.props.onChange(null, { value: true });
  //   // expect(wrapper).toMatchSnapshot();
  // });
});
