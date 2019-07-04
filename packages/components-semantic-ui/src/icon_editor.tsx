import { EditorComponent } from '@toryjs/form';
import { propGroup, prop } from '@toryjs/ui';
import { observer } from 'mobx-react';

import { IconView } from './icon_view';

export const IconEditor: EditorComponent = {
  Component: observer(IconView),
  title: 'Icon',
  control: 'Icon',
  icon: 'bath',
  props: propGroup('Icon', {
    name: prop({
      label: 'Icon',
      type: 'string',
      documentation:
        'Please see the list of icons here: <a href="https://react.semantic-ui.com/elements/icon/" target="_blank">https://react.semantic-ui.com/elements/icon/</a>'
    })
  })
};
