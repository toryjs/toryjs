import { bindCatalogues } from '@toryjs/ui';

import { catalogue } from '../catalogue';
import { catalogueEditor } from '../catalogue_editor';

export { create } from '@toryjs/ui';
export const { prepareComponent, testEditor, testReadonly, testStandard } = bindCatalogues(
  catalogue,
  catalogueEditor
);
