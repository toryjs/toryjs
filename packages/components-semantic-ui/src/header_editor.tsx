import { EditorComponent } from '@toryjs/form';
import { propGroup, boundProp } from '@toryjs/ui';
import { observer } from 'mobx-react';

import { HeaderView } from './header_view';
import { colors, sizes, align } from './enums';

export const HeaderEditor: EditorComponent = {
  Component: observer(HeaderView),
  title: 'Header',
  control: 'Header',
  icon: 'font',
  props: propGroup('Header', {
    titleSource: boundProp({}),
    attached: boundProp({
      control: 'Select',
      props: {
        options: [
          { text: 'None', value: '--' },
          { text: 'Top', value: 'top' },
          { text: 'Bottom', value: 'bottom' }
        ]
      }
    }),
    block: boundProp({ type: 'boolean' }),
    color: boundProp({ control: 'Select', props: { options: colors } }),
    content: boundProp({}),
    disabled: boundProp({ type: 'boolean' }),
    dividing: boundProp({ type: 'boolean' }),
    floated: boundProp({
      control: 'Select',
      props: {
        options: [
          { text: 'None', value: '--' },
          { text: 'Left', value: 'left' },
          { text: 'Right', value: 'right' }
        ]
      }
    }),
    icon: boundProp({}),
    image: boundProp({}),
    inverted: boundProp({ type: 'boolean' }),
    size: boundProp({ control: 'Select', props: { options: sizes } }),
    sub: boundProp({ type: 'boolean' }),
    subheader: boundProp({ control: 'Textarea' }),
    textAlign: boundProp({ control: 'Select', props: { options: align } })
  })
};
