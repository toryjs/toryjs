import * as Gql from './gql';

import React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { FormComponentProps } from '@toryjs/form';

import { Context } from '../../context';
import { PageView, RouteProps } from '../../react-router/react_router_view';
import { root } from '../../common';
import Login from './login';
import { observer } from 'mobx-react';

/* =========================================================
    Private Route
   ======================================================== */

export type PrivateRouteProps = RouteProps & {
  disable: boolean;
};

export const LoggedInView = observer(
  (props: FormComponentProps<PrivateRouteProps> & { result: any; routerProps: any }) => {
    const { routerProps } = props;
    const ctx = React.useContext(Context);

    const Component = React.useMemo(() => {
      const page = root(props.formElement).pages.find(p => p.uid === props.formElement.props.page);
      const RouteView = (routerProps: RouteComponentProps<any>) => (
        <PageView {...routerProps} {...props} formElement={page} />
      );
      return RouteView;
    }, [props]);

    let user = ctx.auth.user;
    let token = localStorage.getItem(ctx.authToken);

    if (token && !user) {
      return (
        <Gql.ResumeQueryComponent variables={{ token: localStorage.getItem(ctx.authToken) }}>
          {(result: any) => {
            if (result.loading || !result.data) {
              return <div>Authorising ...</div>;
            } else {
              if (result.error || !result.data.resume.user) {
                return <Login />;
              } else {
                if (!ctx.auth.user) {
                  ctx.auth.user = result.data.resume.user;
                  ctx.auth.logout = () => {
                    localStorage.removeItem(ctx.authToken);
                    ctx.auth.user = null;
                  };
                }
                return <Component {...routerProps} />;
              }
            }
          }}
        </Gql.ResumeQueryComponent>
      );
    } else if (user) {
      return <Component {...routerProps} />;
    } else {
      return <Login />;
    }
  }
);

export const PrivateReactRouterRoute: React.FC<FormComponentProps<PrivateRouteProps>> = props => {
  // const ctx = React.useContext(Context);
  return (
    <Route
      exact={!!props.formElement.props.exact}
      path={props.formElement.props.path}
      render={routerProps => <LoggedInView {...props} routerProps={routerProps} />}
    />
  );
};
