import * as React from 'react';
import { ToryForm } from '@toryjs/ui';
import { componentCatalogue } from './config/component_catalogue';
import { handlers } from './config/handlers';
import { storage } from './config/storage';

const Editor: React.FC = props => (
  <ToryForm
    catalogue={componentCatalogue}
    project={process.env.NODE_ENV === 'production' ? require('./forms/default.json') : undefined}
    storage={process.env.NODE_ENV === 'development' ? storage : undefined}
    handlers={handlers}
  />
);

export default Editor;
