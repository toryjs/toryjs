import * as React from 'react';

import {
  BrowserRouter,
  Router,
  Route,
  Link,
  Redirect,
  Switch,
  RouteComponentProps
} from 'react-router-dom';
import { observer } from 'mobx-react';
import { FormComponentProps, FormComponent } from '@toryjs/form';
import {
  createComponents,
  tryInterpolate,
  FormView,
  DynamicComponent,
  datasetRoot
} from '@toryjs/ui';

import { createMemoryHistory } from 'history';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
const history = canUseDOM ? undefined : createMemoryHistory();

export type ReactRouterProps = {
  disable: boolean;
  testRoute: string;
};

/* =========================================================
    Provider
   ======================================================== */

export const ReactRouterProvider: React.FC<FormComponentProps<ReactRouterProps>> = props => {
  return canUseDOM ? (
    <BrowserRouter>{createComponents(props)}</BrowserRouter>
  ) : (
    <Router history={history}>{createComponents(props)}</Router>
  );
};

/* =========================================================
    Route
   ======================================================== */

export type RouteProps = {
  path: string;
  page: string;
  exact?: boolean;
};

type PropAssignProps = FormComponentProps & RouteComponentProps<any> & { Component?: any };

export class PageView extends React.PureComponent<PropAssignProps> {
  assignParams() {
    if (this.props.match.params) {
      for (let key of Object.keys(this.props.match.params)) {
        try {
          if (this.props.owner.getValue(key) != this.props.match.params[key]) {
            this.props.owner.setValue(key, this.props.match.params[key]);
          }
        } catch (ex) {
          console.warn(ex);
        }
      }
    }
  }
  componentWillMount() {
    this.assignParams();
  }
  componentWillUpdate() {
    this.assignParams();
  }
  render() {
    return <FormView {...this.props} />;
  }
}

const EmptyPage: React.FC<FormComponentProps<RouteProps>> = props => (
  <DynamicComponent {...props}>Please select a page ...</DynamicComponent>
);

export const ReactRouterRoute: React.FC<FormComponentProps<RouteProps>> = props => {
  const Component = React.useMemo(() => {
    const page = datasetRoot(props.formElement).pages.find(
      p => p.uid === props.formElement.props.page
    );

    if (!page) {
      return () => <EmptyPage {...props} />;
    }

    const RouteView = (routerProps: RouteComponentProps<any>) => (
      <PageView {...routerProps} {...props} formElement={page} />
    );
    return RouteView;
  }, [props]);
  Component.displayName = 'MemoRoute';

  return (
    <DynamicComponent
      {...props}
      control={Route}
      exact={!!props.formElement.props.exact}
      path={props.formElement.props.path}
      component={Component}
    />
  );
};

ReactRouterRoute.displayName = 'ReactRouterRoute';

/* =========================================================
    Switch
   ======================================================== */

export type SwitchProps = {
  config: RouteProps[];
};

export const ReactRouterSwitch: React.FC<FormComponentProps<SwitchProps>> = props => {
  const { formElement, ...rest } = props;

  if (!props.formElement.props.config) {
    return null;
  }

  return (
    <Switch>
      {props.formElement.props.config.map((c, i) => {
        return (
          <ReactRouterRoute
            key={i}
            {...rest}
            formElement={{ ...formElement, parent: formElement.parent, props: c }}
          />
        );
      })}
    </Switch>
  );
};

ReactRouterSwitch.displayName = 'ReactRouterSwitch';

/* =========================================================
    LINK
   ======================================================== */

export type LinkProps = {
  text: string;
  url: string;
};

const ReactRouterLink: React.FC<FormComponentProps<LinkProps>> = props => {
  const {
    owner,
    formElement,
    formElement: {
      props: { text, url }
    }
  } = props;
  return (
    <DynamicComponent {...props} control={Link} to={tryInterpolate(url, owner)}>
      {tryInterpolate(text, owner) ||
        (formElement.elements && formElement.elements.length && createComponents(props)) ||
        '[⚓︎ Link]'}
    </DynamicComponent>
  );
};

export const ReactRouterLinkView: FormComponent<LinkProps> = {
  Component: observer(ReactRouterLink),
  toString: (owner, props) => {
    return `[${props.formElement.props.url}] ${tryInterpolate(props.formElement.props.url, owner)}`;
  }
};

/* =========================================================
    Redirect
   ======================================================== */

export type RedirectProps = {
  url: string;
};

export const ReactRouterRedirect: React.FC<FormComponentProps<LinkProps>> = ({
  owner,
  formElement: {
    props: { url }
  }
}) => <Redirect to={tryInterpolate(url, owner)} />;
