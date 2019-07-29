import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { ReactRouterRoute, routeProps, thumbnails } from '@toryjs/components-react-router';
import { observer } from 'mobx-react';
import { PrivateRouteProps, PrivateReactRouterRoute } from './auth_view';
import { propGroup, prop } from '@toryjs/ui';

const PrivateReactRouterRouteEditorComponent: React.FC<
  FormComponentProps<PrivateRouteProps>
> = observer(props => {
  // const state = React.useContext(EditorContext);
  props.formElement.props.page;
  return props.formElement.props.disable ? (
    <ReactRouterRoute {...props} />
  ) : (
    <PrivateReactRouterRoute {...props} />
  );
});

export const PrivateReactRouterRouteEditor: EditorComponent = {
  Component: PrivateReactRouterRouteEditorComponent,
  title: 'Private Route',
  control: 'PrivateReactRouterRoute',
  thumbnail: thumbnails,
  group: 'React Router',
  props: propGroup('Router', {
    ...routeProps,
    disable: prop({
      label: 'Disable Auth',
      control: 'Checkbox',
      group: 'Route',
      type: 'boolean'
    })
  })
};
