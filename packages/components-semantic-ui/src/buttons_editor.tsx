import { EditorComponent } from '@toryjs/form';
import { propGroup, handlerProp, boundProp } from '@toryjs/ui';

import { observer } from 'mobx-react';
import { ButtonComponent } from './buttons_view';
import { colors } from './enums';

// export const ApproveButton: EditorComponent = {
//   Component: observer(Approve),
//   title: 'Approve Button',
//   control: 'ApproveButton',
//   icon: 'check',
//   group: 'Buttons'
// };

// export const DeleteButton: EditorComponent = {
//   Component: observer(Delete),
//   title: 'Delete Button',
//   control: 'Delete Button',
//   icon: 'trash',
//   group: 'Buttons'
// };

export const ButtonEditor: EditorComponent = {
  Component: observer(ButtonComponent),
  title: 'Button',
  control: 'Button',
  icon: 'box',
  group: 'Buttons',
  props: {
    ...propGroup('Button', {
      onClick: handlerProp({}),
      icon: boundProp({}),
      color: boundProp({
        control: 'Select',
        label: 'Color',
        props: {
          options: colors
        }
      }),
      content: boundProp({})
    })
  }
};

// export const RejectButton: EditorComponent = {
//   Component: observer(Reject),
//   title: 'Reject Button',
//   control: 'RejectButton',
//   icon: 'ban',
//   group: 'Buttons'
// };

// export const SubmitButton: EditorComponent = {
//   Component: observer(Submit),
//   title: 'Submit Button',
//   control: 'SubmitButton',
//   icon: 'download',
//   group: 'Buttons'
// };
