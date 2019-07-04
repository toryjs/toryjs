import { create } from '@toryjs/ui';
import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent, testStandard, testEditor } from './common';

const countries = [{ text: 'Australia', value: 'AU' }, { text: 'Slovakia', value: 'SK' }];

const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          value: { type: 'string' }
        }
      }
    },
    country: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    countries: {
      $enum: countries
    },
    cities: {
      $enum: [
        { text: 'Sydney', value: 'SYD', country: 'AU' },
        { text: 'Melbourne', value: 'MEL', country: 'AU' },
        { text: 'Kosice', value: 'KE', country: 'SK' },
        { text: 'Bratislava', value: 'BA', country: 'SK' }
      ]
    }
  }
};

const formDefinition: FormElement = create.stack({
  elements: [
    {
      control: 'Dropdown',
      props: {
        text: 'Dropdown'
      },
      elements: [
        {
          control: 'Text',
          props: { value: 'First', name: 'first' }
        },
        {
          control: 'Text',
          props: { value: 'Second', name: 'second' }
        }
      ]
    },
    {
      control: 'Text',
      props: {
        value: 'Pre-Selected'
      }
    },
    {
      control: 'Dropdown',
      props: {
        selection: true,
        value: { source: 'name' },
        options: [
          {
            text: 'First',
            value: 'first'
          },
          {
            text: 'Second',
            value: 'second'
          }
        ]
      }
    },
    {
      control: 'Text',
      props: {
        value: 'Bound'
      }
    },
    {
      control: 'Dropdown',

      props: {
        value: { source: 'name' },
        selection: true,
        options: { source: 'items' }
      }
    },
    {
      control: 'Text',
      props: {
        value: 'Filtered'
      }
    },
    {
      props: {
        schemaSource: 'countries',
        label: 'Country',
        selection: true,
        search: true,
        value: { source: 'country' }
      },
      control: 'Dropdown'
    },
    {
      control: 'Dropdown',
      props: {
        filterSource: 'country',
        filterColumn: 'country',
        schemaSource: 'cities',
        search: true,
        selection: true,
        value: { source: 'city' },
        label: 'City'
      }
    },
    {
      props: {
        options: { handler: 'syncCountries' },
        label: 'Sync',
        value: { source: 'country' },
        selection: true
      },
      control: 'Dropdown'
    },
    {
      props: {
        asyncOptions: 'asyncCountries',
        label: 'Async',
        value: { source: 'country' },
        selection: true
      },
      control: 'Dropdown'
    },
    {
      control: 'Menu',
      elements: [
        {
          control: 'Dropdown',
          props: {
            options: { source: 'items' },
            value: { source: 'name' },
            item: true
          }
        },
        {
          control: 'Dropdown',
          props: {
            value: { source: 'name' },
            item: true,
            elements: []
          }
        }
      ]
    }
  ]
});

const formData = {
  name: 'second',
  items: [{ text: 'Tomi', value: 'first' }, { text: 'Valeria', value: 'second' }],
  country: 'SK',
  city: 'KE'
};

describe('Dropdown', () => {
  it('renders standard', () => {
    testStandard(formDefinition, schema, formData);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, formData);
  });

  return {
    component: prepareComponent(formDefinition, schema, formData, {
      showReadOnly: true,
      showToolBox: true,
      addEditor: true,
      handlers: {
        syncCountries() {
          return countries;
        },
        asyncCountries() {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(countries);
            }, 1500);
          });
        }
      }
    })
  };
});
