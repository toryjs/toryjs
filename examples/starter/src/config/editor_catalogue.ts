import {
  merge,
  vanillaEditorCatalogue,
  semanticEditorCatalogue,
  routerEditorCatalogue,
  alertEditorCatalogue
} from '@toryjs/ui';

export const editorCatalogue = merge(
  vanillaEditorCatalogue,
  semanticEditorCatalogue,
  routerEditorCatalogue,
  alertEditorCatalogue
);
