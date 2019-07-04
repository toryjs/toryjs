import { EditorComponent } from '@toryjs/form';
import { propGroup, boundProp } from '@toryjs/ui';

import { MaskedView } from './masked_view';

export const MaskedEditor: EditorComponent = {
  Component: MaskedView,
  title: 'Masked Input',
  control: 'MaskedInput',
  icon: 'square outline',
  bound: true,
  props: propGroup('Input', {
    value: boundProp({}),
    mask: boundProp(),
    placeholder: boundProp(),
    dateFormat: boundProp()
  }),
  defaultProps: {
    fluid: true
  }
};
