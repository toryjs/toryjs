import { EditorComponent } from '@toryjs/form';
import { propGroup, handlerProp } from '@toryjs/ui';

import { WindowView } from './window_view';

export const WindowEditor: EditorComponent = {
  Component: WindowView,
  title: 'Window',
  control: 'Window',
  icon: 'square outline',
  provider: true,
  props: propGroup('Window', {
    scrollTop: handlerProp(),
    scrollBottom: handlerProp(),
    resize: handlerProp(),
    init: handlerProp()
  })
};
