import { bindCatalogues } from '@toryjs/test-support';
import { TestComponent } from '@toryjs/editor';

import { catalogue } from '../catalogue';
import { catalogueEditor } from '../catalogue_editor';

export const { prepareComponent, testEditor, testReadonly, testStandard, create } = bindCatalogues(
  catalogue,
  catalogueEditor,
  TestComponent
);
