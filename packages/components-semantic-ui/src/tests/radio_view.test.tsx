import { JSONSchema } from '@toryjs/form';
import { prepareComponent, create } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    religion: {
      type: 'string'
    },
    linedReligion: {
      type: 'string'
    },
    religions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          value: { type: 'string' }
        }
      },
      $enum: [
        { text: 'Christian', value: 'CH' },
        { text: 'Buddhist', value: 'BU' },
        { text: 'Jedi', value: 'JE' }
      ]
    }
  }
};

const formData = {
  religion: 'JE',
  linedReligion: 'BU',
  religions: [
    { text: 'Christian', value: 'CH' },
    { text: 'Buddhist', value: 'BU' },
    { text: 'Jesus', value: 'JE' }
  ]
};

const formDefinition = create.stack({
  elements: [
    {
      props: {
        schemaSource: 'religions',
        label: 'Religions',
        value: { source: 'religion' },
        inline: true
      },
      control: 'Radio'
    },
    {
      props: {
        vertical: true,
        options: [
          { text: 'Christian', value: 'CH' },
          { text: 'Buddhist', value: 'BU' },
          { text: 'Jehova', value: 'JE' }
        ],
        label: 'Religions',
        value: { source: 'linedReligion' }
      },
      control: 'Radio'
    },
    {
      props: {
        options: { source: 'religions' },
        label: 'Religions',
        value: { source: 'religion' },
        inline: true
      },
      control: 'Radio'
    }
  ]
});

// just another notation
describe('Radio', () => {
  // it('renders', function() {
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
