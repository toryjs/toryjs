import { JSONSchema } from '@toryjs/form';

import { prepareComponent, testStandard, testEditor, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    agree: {
      type: 'boolean'
    },
    disagree: {
      type: 'boolean'
    },
    must: {
      type: 'boolean',
      errorMessage: 'You must agree to terms and conditions'
    }
  },
  required: ['must']
};

const data = { agree: true, disagree: false };

const formDefinition = create.stack({
  elements: [
    {
      props: { text: 'Agree With Terms and Conditions', value: { source: 'agree' } },
      control: 'Checkbox'
    },
    {
      control: 'Checkbox',
      props: {
        text: 'Disagree With Terms and Conditions',
        toggle: true,
        value: { source: 'disagree' }
      }
    },
    {
      control: 'Checkbox',
      props: {
        text: 'Disagree With Terms and Conditions',
        slider: true,
        value: { source: 'disagree' }
      }
    },
    {
      props: { text: 'Must Agree With Terms and Conditions', value: { source: 'must' } },
      control: 'Checkbox'
    }
  ]
});

describe('Checkbox', () => {
  // just another notation

  it('renders standard', () => {
    testStandard(formDefinition, schema, data);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, data);
  });

  // it('renders correctly', () => {
  //   const wrapper = renderer.create(component());
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('changes value and all related formulas', () => {
  //   const wrapper = renderer.create(component());
  //   const root = wrapper.root;
  //   const agree = root.findAllByProps({ name: 'agree' })[0];
  //   agree.props.onChange(null, { checked: false });

  //   const disagree = root.findAllByProps({ name: 'disagree' })[0];
  //   disagree.props.onChange(null, { checked: true });

  //   const must = root.findAllByProps({ name: 'must' })[0];
  //   must.props.onChange(null, { checked: true });
  //   expect(wrapper).toMatchSnapshot();

  //   expect(config.setDirty).called;
  // });

  return {
    component: prepareComponent(formDefinition, schema, data, {
      addEditor: true,
      showToolBox: false,
      showStandard: false,
      validate: true
    })
  };
});
