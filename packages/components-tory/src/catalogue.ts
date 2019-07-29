import { FormComponentCatalogue } from '@toryjs/form';
import { DatasetEditor } from '@toryjs/editor';
import { FormEditorEditor } from './form_editor_editor';

export const catalogue: FormComponentCatalogue = {
  components: {
    DatasetEditor: DatasetEditor,
    FormEditor: FormEditorEditor.Component
  },
  cssClass: ''
};
