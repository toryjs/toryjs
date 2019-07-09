import { bindCatalogues } from '@toryjs/test-support';
import { TestComponent } from '@toryjs/editor';

import { catalogue } from '../catalogue';
import { catalogueEditor } from '../catalogue_editor';

export { create } from '@toryjs/test-support';
export const { prepareComponent, testEditor, testReadonly, testStandard } = bindCatalogues(
  catalogue,
  catalogueEditor,
  TestComponent
);
