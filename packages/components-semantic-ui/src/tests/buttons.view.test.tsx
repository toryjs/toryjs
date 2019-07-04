// import * as renderer from 'react-test-renderer';

import { JSONSchema } from '@toryjs/form';
import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    approved: {
      type: 'boolean'
    },
    value: {
      type: 'string'
    }
  },
  required: ['name']
};

let formDefinition = {
  control: 'Grid',
  props: {
    rows: 3,
    columns: 4
  },
  elements: [
    {
      control: 'Button',
      props: {
        target: 'https://www.google.com',
        icon: { value: 'anchor' },
        color: { value: 'teal' },
        content: { value: 'Google' },
        row: 1,
        column: 2,
        width: 1
      }
    }
  ]
};

const formData = {
  description: 'Some Description'
};

describe('Buttons', () => {
  // it('renders correctly', () => {
  //   const wrapper = renderer.create(component());
  //   expect(wrapper).toMatchSnapshot();
  // });

  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      handlers: {
        approve: () => console.log('Approve Clicked'),
        reject: () => console.log('Reject Clicked')
      }
    })
  };
});
