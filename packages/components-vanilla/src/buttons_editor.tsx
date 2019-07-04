import { EditorComponent } from '@toryjs/form';
import { ButtonView, ButtonProps } from './buttons_view';
import { observer } from 'mobx-react';
import { propGroup, handlerProp, boundProp, prop } from '@toryjs/ui';

export const ButtonEditor: EditorComponent<ButtonProps> = {
  Component: observer(ButtonView.Component),
  title: 'Button',
  control: 'Button',
  icon: 'box',
  group: 'Form',
  props: propGroup('Button', {
    content: boundProp({}),
    onClick: handlerProp({}),
    buttonType: prop({
      control: 'Select',
      props: {
        options: [
          { text: 'button', value: 'button' },
          { text: 'submit', value: 'submit' },
          { text: 'reset', value: 'reset' }
        ]
      }
    })
  })
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
