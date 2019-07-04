import { create } from '@toryjs/ui';
import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    country: {
      type: 'string'
    },
    selectedCountry: {
      type: 'string'
    }
  }
};

const options = [{ title: 'Australia', value: 'AUS' }, { title: 'Slovakia', value: 'SVK' }];

const controlledOptions = [
  { titles: ['Australia', 'Sydney'], value: 'SYD' },
  { titles: ['Australia', 'Melbourne'], value: 'SYD' },
  { titles: ['New Zealand', 'Christchurch'], title: 'Kiwis', value: 'SYD' }
];

const formDefinition: FormElement = create.stack({
  elements: [
    create.formElement({
      props: {
        search: 'search',
        searchName: 'findCountry',
        label: 'Country',
        value: { source: 'country' }
      },
      control: 'Search'
    }),
    create.formElement({
      props: {
        search: 'search',
        searchName: 'Name',
        label: 'Country',
        value: { source: 'country' }
      },
      control: 'Search'
    }),
    create.formElement({
      props: {
        renderTemplate: `<table><tr><td width="100">{0}<!--country--></td><td>{1}<!--city--></td></tr></table>`,
        search: 'findCountryWithControl',
        label: 'Country With Control',
        value: { source: 'country' },
        searchName: 'Name'
      },

      control: 'Search'
    })
    // create.formElement({
    //   row: 0,
    //   column: 12,
    //   width: 4,
    //   handler: 'findCountry',
    //   control: 'Search',
    //   label: 'Selected',
    //   source: 'selectedCountry'
    // })
  ]
});

const formData = { country: 'AUS' };

describe('Search', function() {
  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      handlers: {
        search: ({ args: { lookup, value, searchByValue } }: any) => {
          if (lookup === 'findCountry') {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(
                  options.filter(o =>
                    searchByValue ? o.value === value : o.title.indexOf(value) >= 1
                  )
                );
              }, 100);
            });
          } else {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(
                  controlledOptions.filter(o =>
                    searchByValue ? o.value === value : o.titles[0].indexOf(value) >= 1
                  )
                );
              }, 100);
            });
          }
        },
        findCountryWithControl: () => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(controlledOptions);
            }, 100);
          });
        }
      }
    })
  };
});
