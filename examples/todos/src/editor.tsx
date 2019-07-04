import * as React from 'react';
import { IProject, ToryEditor, ServerStorage } from '@toryjs/ui';
import { componentCatalogue } from './config/component_catalogue';
import { editorCatalogue } from './config/editor_catalogue';
import { handlers } from './config/handlers';
import { storage } from './config/storage';

const Editor: React.FC = props => (
  <ToryEditor
    componentCatalogue={componentCatalogue}
    editorCatalogue={editorCatalogue}
    storage={storage}
    handlers={handlers}
    loadStyles={false}
  />
);

export default Editor;
