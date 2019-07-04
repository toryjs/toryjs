import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { docsGroup } from '@toryjs/ui';

import { catalogue } from '../catalogue';
import { catalogueEditor } from '../catalogue_editor';

const Docs = docsGroup({
  catalogue,
  editorCatalogue: catalogueEditor,
  url: 'http://localhost:9001/api'
});

const M = () => (
  <>
    <Docs id={'default'} />
    <Docs id={'d2'} />,
  </>
);

ReactDOM.render(<M />, document.getElementById('root'));
