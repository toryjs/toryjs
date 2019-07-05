import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { observer } from 'mobx-react';
import { propGroup, prop, handlerProp, DropComponentEditor, boundProp } from '@toryjs/ui';

import { MenuItem, MenuView, MenuProps } from './menu_view';
import { colors } from './enums';

export const MenuEditorComponent: React.FC<FormComponentProps<MenuProps>> = props => (
  <DropComponentEditor
    {...props}
    Component={observer(MenuView)}
    layout={props.formElement.props.vertical ? 'column' : 'row'}
  />
);

export const MenuEditor: EditorComponent = {
  Component: observer(MenuEditorComponent),
  title: 'Menu',
  control: 'Menu',
  icon: 'window maximize outline',
  group: 'Form',
  props: {
    ...propGroup('Menu', {
      attached: prop({
        control: 'Select',
        label: 'Attached',
        type: 'string',
        $enum: [
          { text: 'None', value: '--' },
          { text: 'top', value: 'Top' },
          { text: 'bottom', value: 'Bottom' }
        ]
      }),
      inverted: prop({
        control: 'Checkbox',
        label: 'Inverted',
        type: 'boolean'
      }),
      subMenu: prop({
        control: 'Checkbox',
        label: 'Sub Menu',
        type: 'boolean'
      }),
      tabular: prop({
        control: 'Checkbox',
        label: 'Tabular',
        type: 'boolean'
      }),
      color: prop({
        control: 'Select',
        label: 'Color',
        type: 'string',
        $enum: colors
      }),
      position: prop({
        control: 'Select',
        label: 'Position',
        type: 'string',
        props: {
          options: [{ text: 'Left', value: 'left' }, { text: 'Right', value: 'right' }]
        }
      }),
      final: prop({
        type: 'boolean'
      })
    })
  },
  childProps: propGroup('Menu', {
    name: prop({
      label: 'Name',
      type: 'string'
    }),
    customItem: prop({
      label: 'Custom Item',
      type: 'boolean',
      control: 'Checkbox',
      documentation:
        'Enable, if contained item defines its own menu item structure, such as Dropdown'
    })
  })
};

export const MenuItemEditor: EditorComponent = {
  Component: MenuItem,
  title: 'Menu Item',
  control: 'MenuItem',
  icon: 'window maximize outline',
  group: 'Form',
  props: {
    ...propGroup('Menu', {
      content: prop(),
      icon: prop(),
      active: boundProp({ type: 'boolean' })
    }),
    ...propGroup('Handlers', {
      onClick: handlerProp()
    })
  }
};
