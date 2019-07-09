import React from 'react';
import { IProject } from '@toryjs/ui';

const project: IProject = {
  form: {
    control: 'Form',
    elements: []
  },
  schema: {
    type: 'object',
    properties: {}
  },
  uid: '1'
};

import { docsGroup } from '../../components/example';

import { catalogue } from '@toryjs/components-vanilla';
import { catalogueEditor } from '@toryjs/components-vanilla';

const Example = docsGroup({
  catalogue,
  editorCatalogue: catalogueEditor,
  url: 'http://localhost:9001/api'
});

describe('Form editor', () => {
  return {
    component: () => <Example project={project} />
  };
});
