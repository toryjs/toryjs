import React from 'react';
import { Label } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { MemoryRouter } from 'react-router';

import { EditorComponent, FormComponentProps, config, PropMap } from '@toryjs/form';

import {
  ReactRouterProvider,
  ReactRouterProps,
  ReactRouterRoute,
  ReactRouterSwitch,
  ReactRouterLinkView,
  RedirectProps
} from './react_router_view';

import { root, createComponents } from '../common';
import { propGroup, prop, boundProp } from '../editor/editor_common';
import { DynamicComponent } from '../components/dynamic_component';
import { EditorDropCell } from '../editor/layouts_common_editor';
import { getValue } from '../helpers';
import { EditorContext } from '../editor/editor_context';

export const thumbnails = {
  dark:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE0NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTQ0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAg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',
  light:
    'data:image/png;base64,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'
};

/* =========================================================
    Provider
   ======================================================== */

const DisabledRouter: React.FC<FormComponentProps<ReactRouterProps>> = props => (
  <MemoryRouter initialEntries={[props.formElement.props.testRoute]}>
    {createComponents(props)}
  </MemoryRouter>
);

DisabledRouter.displayName = 'DisabledRouter';

export const ReactRouterProviderEditorComponent: React.FC<
  FormComponentProps<ReactRouterProps>
> = props => {
  const context = React.useContext(EditorContext);
  let route = getValue(props, context, 'testRoute');
  return (
    <DynamicComponent
      {...props}
      preserveProps={true}
      label={config.i18n`Router Provider`}
      control={
        !props.formElement.elements || props.formElement.elements.length == 0
          ? EditorDropCell
          : route
            ? DisabledRouter
            : ReactRouterProvider
      }
    />
  );
};

export const ReactRouterProviderEditor: EditorComponent = {
  Component: observer(ReactRouterProviderEditorComponent),
  title: 'React Router Provider',
  control: 'ReactRouterProvider',
  thumbnail: thumbnails,
  provider: true,
  group: 'React Router',
  props: propGroup('Editor', {
    testRoute: boundProp({
      documentation: 'This is useful during testing when a mocked provider can be used instead.'
    })
  })
};

export const routeProps: PropMap = propGroup('Router', {
  exact: prop({
    group: 'Route',
    control: 'Checkbox',
    documentation:
      'Allows to match the path "exactly". For example route "/" without "exact" would match also "/home"',
    label: 'Exact',
    type: 'boolean'
  }),
  path: prop({
    group: 'Route',
    label: 'Path',
    documentation: 'Path / Route to match',
    type: 'string'
  }),
  page: prop({
    control: 'Select',
    group: 'Route',
    label: 'Page',
    documentation: 'Page to display',
    props: {
      options: { handler: 'optionsProjectPages' }
    },
    type: 'string'
  })
});

export const ReactRouterRouteEditor: EditorComponent = {
  Component: observer(ReactRouterRoute),
  title: 'Route',
  control: 'ReactRouterRoute',
  thumbnail: thumbnails,
  group: 'React Router',
  props: routeProps,
  handlers: {
    optionsProjectPages: ({ owner }) => {
      const form = root(owner);
      return form.pages
        ? form.pages.map(p => ({
          text: p.props.label,
          value: p.uid
        }))
        : [];
    }
  }
};

/* =========================================================
    Switch
   ======================================================== */

export const ReactRouterSwitchEditor: EditorComponent = {
  Component: observer(ReactRouterSwitch),
  title: 'Switch',
  control: 'ReactRouterSwitch',
  thumbnail: thumbnails,
  group: 'React Router',
  props: {
    config: prop({
      control: 'Table',
      props: { text: 'Routes' },
      elements: [
        {
          control: 'Input',
          props: { placeholder: 'path', label: 'Path', value: { source: 'path' } }
        },
        {
          control: 'Select',
          props: {
            label: 'Page',
            value: { source: 'page' },
            options: { handler: 'optionsProjectPages' }
          },
          documentation: 'Page to display'
        },
        {
          control: 'Checkbox',
          props: {
            label: 'Exact',
            width: '20px',
            value: { source: 'exact' }
          }
        }
      ],
      type: 'array',
      items: {
        type: 'object',
        properties: {
          exact: { type: 'boolean' },
          path: { type: 'string' },
          page: { type: 'string' }
        }
      }
    })
  }
};

/* =========================================================
    Link
   ======================================================== */

export const ReactRouterLinkEditor: EditorComponent = {
  Component: ReactRouterLinkView.Component,
  title: 'Link',
  control: 'ReactRouterLink',
  thumbnail: thumbnails,
  group: 'React Router',
  props: propGroup('Router', {
    url: prop({
      label: 'Url',
      documentation:
        'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.',
      type: 'string'
    }),
    text: prop({
      label: 'Text',
      documentation:
        'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.',
      type: 'string'
    })
  })
};

/* =========================================================
    Link
   ======================================================== */

export const ReactRouterRedirectEditorComponent: React.FC<
  FormComponentProps<RedirectProps>
> = observer(props => <Label content={`Redirect to: ${props.formElement.props.url}`} />);

export const ReactRouterRedirectEditor: EditorComponent = {
  Component: ReactRouterRedirectEditorComponent,
  title: 'Redirect',
  control: 'ReactRouterRedirect',
  icon: 'anchor',
  props: propGroup('Router', {
    url: prop({
      label: 'Url',
      documentation:
        'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.',
      type: 'string'
    })
  })
};
