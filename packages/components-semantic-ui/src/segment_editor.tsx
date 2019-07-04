import { EditorComponent } from '@toryjs/form';
import { propGroup, boundProp } from '@toryjs/ui';

import { SegmentView } from './segment_view';
import { colors, sizes, align } from './enums';

export const SegmentEditor: EditorComponent = {
  Component: SegmentView,
  title: 'Segment',
  control: 'Segment',
  icon: 'window maximize outline',
  props: {
    ...propGroup('Segment', {
      attached: boundProp({
        $enum: [{ value: 'top', text: 'top' }, { value: 'bottom', text: 'bottom' }]
      }),
      basic: boundProp({ type: 'boolean' }),
      circular: boundProp({ type: 'boolean' }),
      clearing: boundProp({ type: 'boolean' }),
      color: boundProp({ $enum: colors }),
      compact: boundProp({ type: 'boolean' }),
      disabled: boundProp({ type: 'boolean' }),
      floated: boundProp({
        $enum: [{ value: 'left', text: 'left' }, { value: 'right', text: 'right' }]
      }),
      inverted: boundProp({ type: 'boolean' }),
      loading: boundProp({ type: 'boolean' }),
      padded: boundProp({ type: 'boolean' }),
      piled: boundProp({ type: 'boolean' }),
      placeholder: boundProp({ type: 'boolean' }),
      raised: boundProp({ type: 'boolean' }),
      secondary: boundProp({ type: 'boolean' }),
      size: boundProp({ $enum: sizes }),
      stacked: boundProp({ type: 'boolean' }),
      tertiary: boundProp({ type: 'boolean' }),
      textAlign: boundProp({ $enum: align }),
      vertical: boundProp({ type: 'boolean' })
    })
  }
};
