import { JSONSchema, FormElement } from '@toryjs/form';

import { create } from '@toryjs/ui';
import { prepareComponent, testStandard, testEditor } from './common';

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
        },
        required: ['name']
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

const formDefinition: FormElement = create.stack({
  props: { final: true },
  elements: [
    {
      props: {
        items: [
          { title: 'Name', source: 'name', type: 'string' },
          { title: 'Capital', source: 'capital', type: 'string' }
        ],
        allowDelete: true,
        allowEdit: true,
        allowAdd: true,
        value: { source: 'countries' }
      },
      control: 'Table',
      elements: [
        {
          elements: []
        },
        {
          elements: []
        },
        {
          elements: []
        }
        // {},
        // {
        //   elements: [
        //     {
        //       control: 'Input',
        //       source: 'name'
        //     }
        //   ]
        // }
        // {
        //   control: 'Grid',
        //   props: {
        //     rows: 1,
        //     columns: 3,
        //     templateColumns: `1fr 1fr auto`,
        //     templateColumnsReadOnly: `1fr 1fr`,
        //     gap: '24px'
        //   },
        //   elements: [
        //     create.formElement({
        //       props: { column: 1 },
        //       control: 'Input',
        //       label: 'Name',
        //       source: 'name'
        //     }),
        //     create.formElement({
        //       props: { column: 2 },
        //       control: 'Input',
        //       label: 'Capital',
        //       source: 'capital'
        //     }),
        //     create.formElement({
        //       props: { column: 3 },
        //       control: 'DeleteButton',
        //       label: '\xa0'
        //     })
        //   ]
        // }
      ]
    }
  ]
});

describe('Table', () => {
  // function component() {
  //   config.setDirty = () => console.log('Now it dirty');
  //   const form = new FormModel(formDefinition, schema, controlData);

  //   // just another notation
  //   return (
  //     <>
  //       <TestComponent form={form} />

  //       <div style={{ marginTop: '20px' }}>
  //         <Button content="Undo" onClick={() => undoManager.undo()} />
  //         <Button content="Redo" onClick={() => undoManager.redo()} />
  //       </div>
  //     </>
  //   );
  // }

  // it('renders correctly', () => {
  //   const wrapper = renderer.create(component());
  //   expect(wrapper).toMatchSnapshot();
  // });

  it('renders standard', () => {
    testStandard(formDefinition, schema, controlData);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, controlData);
  });

  return {
    component: prepareComponent(formDefinition, schema, controlData, { addEditor: true })
  };
});
