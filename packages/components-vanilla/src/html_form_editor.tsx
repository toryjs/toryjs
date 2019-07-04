import { EditorComponent } from '@toryjs/form';
import { propGroup, handlerProp, initSingleEditor } from '@toryjs/ui';

import { HtmlFormComponent } from './html_form_view';

export const HtmlFormEditor: EditorComponent = {
  Component: initSingleEditor(HtmlFormComponent),
  title: 'Html Form',
  control: 'HtmlForm',
  icon: 'font',
  props: propGroup('Form', {
    onSubmit: handlerProp({ documentation: 'Submit handler' })
  })
};
