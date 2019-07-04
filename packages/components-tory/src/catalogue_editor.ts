import { EditorComponentCatalogue } from '@toryjs/form';
import { DatasetEditorComponent } from './dataset_editor_editor';
import { FormEditorEditor } from './form_editor_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  components: {
    DatasetEditor: DatasetEditorComponent,
    FormEditor: FormEditorEditor
  },
  cssClass: ''
};
