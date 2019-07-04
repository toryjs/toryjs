import { EditorComponentCatalogue } from '@toryjs/form';
import { AlertProviderEditor } from './react_alert_provider_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  components: {
    AlertProvider: AlertProviderEditor
  },
  cssClass: ''
};
