// import * as renderer from 'react-test-renderer';

import { JSONSchema, FormElement } from '@toryjs/form';
import { prepareComponent } from '../../tests/common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    person: {
      type: 'string'
    }
  }
};

let elements: FormElement[] = [
  {
    control: 'Text',
    props: { label: 'Param', value: { source: 'person' } }
  },
  {
    control: 'ReactRouterRoute',
    props: {
      page: 'page1',
      path: '/hr/:person'
    }
  },
  {
    control: 'ReactRouterRoute',
    props: {
      page: 'page2',
      path: '/other'
    }
  },
  {
    control: 'Text',
    props: {
      value: '<b>Switch</b>'
    }
  },
  {
    control: 'ReactRouterSwitch',
    props: {
      config: [
        {
          page: 'page1',
          path: '/hr/:person'
        },
        {
          page: 'page2',
          path: '/other'
        }
      ]
    }
  },
  {
    control: 'Text',
    props: {
      value: 'Link',
      css: 'font-weight: bold;'
    }
  },
  {
    control: 'ReactRouterLink',
    props: {
      url: '/home/${person}',
      value: 'Link to: ${person}'
    }
  },
  // {
  //   control: 'Text',
  //   props: {
  //     value: 'Private Route Enabled'
  //   }
  // },
  // {
  //   control: 'PrivateReactRouterRoute',
  //   props: {
  //     page: 'page1',
  //     path: '/hr/:person'
  //   }
  // },
  {
    control: 'Text',
    props: {
      value: 'Private Route Disabled'
    }
  },
  {
    control: 'PrivateReactRouterRoute',
    props: {
      page: 'page1',
      path: '/hr/:person',
      disable: true
    }
  }
];

const formDefinition: FormElement = {
  control: 'Form',
  pages: [
    {
      uid: 'page1',
      props: { label: 'Page 1' },
      elements: [
        {
          control: 'Text',
          props: { value: 'Page 1' }
        }
      ]
    },
    {
      uid: 'page2',
      props: { label: 'Page 2' },
      elements: [
        {
          control: 'Text',
          props: { value: 'Page 2' }
        }
      ]
    }
  ],
  elements: [
    {
      control: 'Stack',
      props: {
        gap: '12px',
        layout: 'column'
      },
      elements: [
        {
          control: 'Text',
          props: { value: 'Empty Router' }
        },
        {
          control: 'ReactRouterProvider',
          elements: []
        },
        {
          control: 'Text',
          props: { value: 'Router With Routes' }
        },
        {
          control: 'Stack',
          props: {
            layout: 'column',
            gap: '3px'
          },
          elements: [
            {
              control: 'ReactRouterProvider',
              props: {
                testRoute: '/hr/tomas'
              },
              elements
            }
          ]
        }
      ]
    }
  ]
};

const formData = {};

describe('ReactRouter', () => {
  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      showToolBox: true
    })
  };
});
