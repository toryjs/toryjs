import { create } from '@toryjs/ui';
import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent } from './common';
import { clone } from '@tomino/toolbelt';

describe('Tabs', () => {
  const formData = {
    description: 'Some Description',
    people: [
      {
        name: 'Tomas Trescak',
        address: 'Sydney, Slovakia'
      },
      {
        name: 'Valeria Toscani',
        address: 'Sydney, Italy'
      },
      {
        name: 'Vittoria Trescakova',
        address: 'Sydney, Australia',
        title: 'Princess'
      }
    ]
  };

  const schema: JSONSchema = {
    type: 'object',
    properties: {
      people: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            title: { type: 'string' }
          }
        }
      }
    },
    required: ['name']
  };

  const formDefinition = create.stack({
    props: {
      editable: false
    },
    elements: [
      {
        control: 'Tabs',

        props: {
          value: { source: 'people' },
          valueField: { value: 'name' },
          textField: { value: 'name' }
        },
        elements: [
          {
            control: 'Grid',
            props: {
              rows: 1,
              columns: 2,
              gap: '24px'
            },
            elements: [
              {
                props: { row: 1, column: 1, value: { source: 'name' }, label: 'Name' },
                control: 'Input'
              },
              {
                props: { row: 1, column: 2, value: { source: 'address' }, label: 'Address' },
                control: 'Input'
              }
            ]
          }
        ]
      },
      {
        control: 'Tabs',
        props: {},
        elements: []
      }
    ]
  });

  describe('Tabular Items', () => {
    let modified: FormElement = clone(formDefinition);
    let menu = modified.elements[0].elements[0];
    menu.props.value.source = undefined;
    menu.props = {
      menuItems: [
        {
          text: 'Tab A',
          value: 'Tab A'
        },
        {
          text: 'Tab B',
          value: 'Tab B'
        },
        {
          text: 'Tab C',
          value: 'Tab C'
        }
      ]
    };
    menu.elements = [
      { control: 'Text', props: { text: 'Content A' } },
      { control: 'Text', props: { text: 'Content B' } }
    ];

    // it('renders tab menu', () => {
    //   const wrapper = renderer.create(component());
    //   expect(wrapper).toMatchSnapshot();
    // });

    return {
      component: prepareComponent(modified, schema, formData, {
        showReadOnly: false,
        addEditor: true
      })
    };
  });

  describe('Tabular Bound', () => {
    // it('renders tab menu', () => {
    //   const wrapper = renderer.create(component());
    //   expect(wrapper).toMatchSnapshot();
    // });

    return {
      component: prepareComponent(formDefinition, schema, formData, {
        addEditor: true,
        showStandard: false
      })
    };
  });

  describe('Side Menu', () => {
    let modified: FormElement = clone(formDefinition);
    let menu = modified.elements[0].elements[0];
    menu.props = {
      ...menu.props,
      vertical: true,
      secondary: true
    };

    // it('renders tab menu', () => {
    //   const wrapper = renderer.create(component());
    //   expect(wrapper).toMatchSnapshot();
    // });

    return prepareComponent(modified, schema, {}, { addEditor: true });
  });
});
