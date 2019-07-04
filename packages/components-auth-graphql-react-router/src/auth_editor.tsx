import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';

import { routeProps } from '../../react-router/react_router_editor';
import { thumbnails } from '../../apollo/apollo_query.editor';
import { ReactRouterRoute } from '../../react-router/react_router_view';
import { observer } from 'mobx-react';
import { PrivateRouteProps, PrivateReactRouterRoute } from './auth_view';
import { propGroup, prop } from '../../editor/editor_common';

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
