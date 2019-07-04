import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { prop, propGroup, createComponents } from '@toryjs/ui';

import { AuthItem, AuthItemProps } from './auth_item_view';
import { observer } from 'mobx-react';

// export const AuthItemEditorComponent: React.FC<FormComponentProps<AuthItemProps>> = observer(
//   props => {
//     return (
//       <LayoutWrapper
//         {...props}
//         label={config.i18n`Auth Item`}
//         ownAddCell={false}
//         Component={props.formElement.props.disable ? CreateComponents : AuthItem}
//       />
//     );
//   }
// );

export const AuthItemEditorComponent: React.FC<FormComponentProps<AuthItemProps>> = observer(
  props =>
    props.formElement.props.disable ? <>{createComponents(props)}</> : <AuthItem {...props} />
);

AuthItemEditorComponent.displayName = 'ApolloProviderEditor';

export const AuthItemEditor: EditorComponent = {
  provider: true,
  Component: AuthItemEditorComponent,
  title: 'Auth Item',
  control: 'AuthItem',
  icon: 'lock',
  group: 'Auth',
  props: {
    ...propGroup('Auth', {
      disable: {
        control: {
          documentation:
            'This is useful during testing when a mocked provider can be used instead.',
          props: { label: 'Disable' },
          group: 'Auth',
          control: 'Checkbox'
        },
        schema: { type: 'boolean' }
      }
    }),
    roles: prop({
      control: 'Table',
      display: 'group',
      props: { text: 'Roles' },
      type: 'array',
      elements: [
        {
          control: 'Input'
        }
      ],
      items: { type: 'string' }
    })
  }
};
