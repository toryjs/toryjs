import * as React from 'react';

import { FormElement } from '@toryjs/form';
import { prepareComponent, EditorState, EditorContext } from '@toryjs/ui';
import { catalogue } from '../catalogue';
import { catalogueEditor } from '../catalogue_editor';

const formDefinition: FormElement = {
  control: 'Stack',
  props: {
    gap: '12px'
  },
  elements: [
    {
      control: 'FormEditor',
      props: {
        formSource: { source: 'form' },
        schemaSource: { source: 'schema' },
        theme: 'light',
        editorHeight: '400px'
      }
    }
  ]
};

describe('Form Editor', () => {
  const Component = prepareComponent(
    {
      formDefinition,
      schema: {
        type: 'object',
        properties: {
          schema: { type: 'string' },
          form: { type: 'string' }
        }
      },
      data: {
        form: JSON.stringify({
          control: 'Form',
          elements: [{ props: { text: 'Yah!', control: 'Text' }, control: 'Text' }]
        }),
        schema: JSON.stringify({
          type: 'object',
          properties: {
            name: { type: 'string', title: 'name' },
            age: { type: 'number', title: 'age' },
            car: {
              type: 'object',
              title: 'car',
              properties: {
                model: { type: 'string', title: 'model' },
                year: { type: 'number', title: 'year' }
              }
            }
          }
        })
      },
      catalogue,
      catalogueEditor
    },
    {
      addEditor: true,
      showReadOnly: false
    }
  );

  const editorContext = new EditorState(catalogue, catalogueEditor, {});

  const Wrapper = () => (
    <EditorContext.Provider value={editorContext}>
      <Component />
    </EditorContext.Provider>
  );

  return {
    component: Wrapper
  };
});
