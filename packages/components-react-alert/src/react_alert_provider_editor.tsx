import { EditorComponent } from '@toryjs/form';

import { positions, transitions } from 'react-alert';
import { observer } from 'mobx-react';
import { propGroup, boundProp, prop } from '@toryjs/ui';

import { AlertProvider } from './react_alert_provider_view';

export const AlertProviderEditor: EditorComponent = {
  provider: true,
  Component: observer(AlertProvider),
  title: 'Alert Provider',
  control: 'AlertProvider',
  icon: 'exclamation',
  group: 'Data',
  defaultProps: {
    position: positions.TOP_RIGHT,
    timeout: 5000,
    transition: transitions.SCALE,
    offset: '30px'
  },
  props: propGroup('Alert', {
    position: boundProp({
      control: 'Select',
      group: 'Alert',
      type: 'string',
      documentation: 'Position where to display the alert',
      props: {
        options: [
          {
            text: 'Top Right',
            value: positions.TOP_RIGHT
          },
          {
            text: 'Top Center',
            value: positions.TOP_CENTER
          },
          {
            text: 'Top Left',
            value: positions.TOP_LEFT
          },
          {
            text: 'Bottom Center',
            value: positions.BOTTOM_CENTER
          },
          {
            text: 'Bottom Left',
            value: positions.BOTTOM_LEFT
          },
          {
            text: 'Bottom Right',
            value: positions.BOTTOM_RIGHT
          },
          {
            text: 'Middle',
            value: positions.MIDDLE
          },
          {
            text: 'Middle Left',
            value: positions.MIDDLE_LEFT
          },
          {
            text: 'Middle Right',
            value: positions.MIDDLE_RIGHT
          }
        ]
      }
    }),
    timeout: prop({ type: 'number', documentation: 'Time in ms when alert is hidden' }),
    offset: prop({ documentation: 'How far from the window edge is the alert displayed' }),
    transition: prop({
      control: 'Select',
      type: 'string',
      documentation: 'Animation used to display the alert',
      props: {
        options: [
          {
            text: 'Fade',
            value: transitions.FADE
          },
          {
            text: 'Scale',
            value: transitions.SCALE
          }
        ]
      }
    })
  })
};
