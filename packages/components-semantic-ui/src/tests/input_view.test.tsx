import { JSONSchema } from '@toryjs/form';

import { create } from '@toryjs/ui';
import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'number',
      minimum: 30
    },
    younger: {
      type: 'string',
      expression: `console.log(this); return this['age'] - 20`
    },
    older: {
      type: 'string',
      expression: `this['age'] + 10`
    }
  },
  required: ['name']
};

const formDefinition = create.grid({
  props: {
    columns: 4,
    rows: 2
  },
  elements: [
    {
      control: 'Input',
      props: {
        row: 1,
        column: 1,
        width: 2,
        inputLabel: 'Name',
        label: 'Mimo',
        value: { source: 'name' }
      }
    },
    {
      props: { row: 2, column: 1, width: 1, value: { source: 'age' }, label: 'Age: ' },
      control: 'Input'
    },
    {
      props: { row: 2, column: 3, width: 2, value: { source: 'younger' }, label: 'Younger:' },
      control: 'Input'
    }
    // {
    //   props: {
    //     row: 1,
    //     column: 3,
    //     width: 2,
    //     value: { source: 'older' },
    //     label: 'Older',
    //     inline: true
    //   },
    //   control: 'Input'
    // }
  ]
});

const formData = {
  name: 'Tomas',
  age: 33
};

describe('Input', () => {
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
