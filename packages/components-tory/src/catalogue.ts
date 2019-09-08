import { FormComponentCatalogue } from '@toryjs/form';
import { DatasetEditor } from '@toryjs/editor';
import FormEditorComponent from './form_editor_editor';

export const catalogue: FormComponentCatalogue = {
  components: {
    DatasetEditor: DatasetEditor,
    FormEditor: FormEditorComponent
  },
  cssClass: ''
};
