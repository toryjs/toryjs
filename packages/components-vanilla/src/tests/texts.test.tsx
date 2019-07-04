import { JSONSchema } from '@toryjs/form';

import { prepareComponent, create, testStandard, testEditor } from './common';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    mother: {
      type: 'string'
    },
    father: {
      type: 'string'
    },
    child: {
      type: 'string'
    }
  },
  definitions: {
    person: {
      type: 'object',
      properties: {
        uid: { type: 'string' },
        name: { type: 'string' }
      }
    }
  }
};

const formDefinition = create.grid({
  props: {
    rows: 3,
    columns: 4
  },
  elements: [
    {
      props: {
        text: 'Hello ${mother}',
        url: 'https://www.google.com',
        row: 1,
        column: 1,
        width: 1
      },
      control: 'Link'
    },
    {
      props: { row: 1, column: 2, width: 1, value: { source: 'child' } },
      control: 'Text'
    },
    {
      props: {
        row: 1,
        column: 3,
        width: 1,
        source: { source: 'mother' },
        target: { source: 'child' },
        text: 'Make Mother'
      },
      control: 'LinkSelector'
    },
    {
      props: {
        row: 1,
        column: 4,
        width: 1,
        target: { source: 'child' },
        source: { source: 'father' },
        text: 'Make Father'
      },
      control: 'LinkSelector'
    },
    {
      props: { row: 3, column: 1, width: 1, value: 'Yah!' },
      control: 'Text'
    },
    {
      props: {
        row: 2,
        column: 2,
        width: 2,
        height: 2,
        imageWidth: { value: '300px' },
        imageHeight: { value: '40px' },
        src: { value: 'https://d20xd7mbt7xiju.cloudfront.net/test/wsu/WSU_logo.jpg' }
      },
      control: 'Image'
    },
    {
      props: { row: 2, column: 1, width: 1, value: 'TOMAS' },
      control: 'Text'
    },
    {
      props: {
        row: 2,
        column: 4,
        width: 1,
        text: 'WSU ${father}',
        imageWidth: '300px',
        imageHeight: '40px',
        url: 'https://www.westernsydney.edu.au'
      },
      control: 'Link'
    }
  ]
});

const formData = {
  father: 'Tomas',
  mother: 'Valeria',
  child: 'Momo'
};

describe('Texts', () => {
  it('renders standard', () => {
    testStandard(formDefinition, schema, formData);
  });

  it('renders editor', () => {
    testEditor(formDefinition, schema, formData);
  });

  return {
    component: prepareComponent(formDefinition, schema, formData, {
      addEditor: true,
      showReadOnly: false,
      showStandard: false,
      showProperties: false,
      showToolBox: false
    })
  };
});
