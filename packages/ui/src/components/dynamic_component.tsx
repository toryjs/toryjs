import React from 'react';
import names from 'classnames';

import { Context } from '../context';
import { FormComponentProps, DataSet } from '@toryjs/form';
import { css } from 'emotion';
import { handle, getValue, isNullOrEmpty, valueSource } from '../helpers';
import { ErrorBoundary } from './error_boundary';
import { createComponents } from '../helpers';
import { observer } from 'mobx-react';
import { ErrorView } from './properties/error_view';

export const breakingLabel = css`
  display: block;
  font-weight: bold;
  margin-top: 3px;
  margin-bottom: 3px;
`;

export const nonBreakingLabel = css`
  display: inline-block;
  font-weight: bold;
  padding-right: 6px;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const defaultMouseEvents = ['onClick', 'onMouseOver', 'onMouseOut', 'onMouseDown', 'onMouseUp'];
const defaultFormEvents = ['onChange', 'onInput'];
const defaultKeyEvents = ['onKeyDown', 'onKeyUp'];
const defaultEvents = [...defaultMouseEvents, ...defaultFormEvents, ...defaultKeyEvents];

const omitKeys = [
  'styleName',
  'catalogue',
  'children',
  'extra',
  'formElement',
  'handlers',
  'owner',
  'className',
  'readOnly',
  'controlProps',
  'control',
  'ownAddCell',
  'EmptyCell',
  'Component',
  'showError',
  'staticContext',
  'routerProps',
  'dataProps',
  'hideLabel',
  'labelPosition',
  'extraControls'
];

function omit(obj: any, keys: string[]) {
  var target: any = {};

  for (var i of Object.keys(obj)) {
    if (keys.indexOf(i) >= 0) continue;
    target[i] = obj[i];
  }

  return Object.keys(target).length > 0 ? target : null;
}

const eventCache: any[] = [];
function getCachedEvent(
  formElement: any,
  event: string,
  props: FormComponentProps,
  context: any,
  extra: any = null,
  events: any = null
) {
  // TODO: Find a better way to cache events
  let current = eventCache.find(c => c.props === props);
  if (!current) {
    current = { props };
    eventCache.push(current);
  }
  if (!current[event]) {
    // TODO: check whether the caching does not lead to
    // incorrect parameters in the long run - [context, prop, props]
    current[event] = (e: React.SyntheticEvent, ui: any) => {
      // execute extra event (usually done by editor)
      if (extra && extra[event]) {
        extra[event](e, ui);
      }

      if (events && events[event]) {
        events[event](e, ui);
      }

      if (formElement.props[event]) {
        handle(props.handlers, formElement.props[event], props.owner, props, context, {
          e,
          ui
        });
      }
    };
  } else {
    console.log('Using cached ...');
  }
  return current[event];
}

export function paintProps<C>(
  props: FormComponentProps<C>,
  context: any,
  className?: string,
  allowedProperties?: string[],
  componentProps?: any
) {
  let result: any = {
    id: props.formElement.uid,
    'data-control': props.formElement.control
  };

  if (props.formElement.props) {
    for (let prop of Object.keys(props.formElement.props)) {
      // events
      if (defaultEvents.indexOf(prop) >= 0) {
        result[prop] = getCachedEvent(
          props.formElement,
          prop,
          props,
          context,
          props.extra,
          componentProps
        );
      } else if (allowedProperties && allowedProperties.indexOf(prop) >= 0) {
        result[prop] = getValue(props, context, prop as keyof C, undefined);
        result[prop] = isNullOrEmpty(result[prop]) ? undefined : result[prop];
      }
    }
  }

  // classnames
  const controlCss = getValue(props, context, 'css');

  if (props.className || controlCss || className || (props.extra && props.extra.className)) {
    result.className = names(
      result[className],
      className,
      props.className,
      props.extra ? props.extra.className : undefined,
      controlCss ? css([controlCss]) : undefined
    );
  }

  // add extra events, these may be passed from parent components
  // this is often used by editor to inject its props or events
  if (props.extra) {
    for (let prop of Object.keys(props.extra)) {
      if (!result[prop]) {
        result[prop] = props.extra[prop];
      }
    }
    // result['extra'] = props.extra;
  }

  if (props.dataProps) {
    result['dataProps'] = props.dataProps;
  }

  // these events are usually passed from the control itself
  if (componentProps) {
    for (let prop of Object.keys(componentProps)) {
      result[prop] = componentProps[prop];
    }
  }

  return result;
}

type WrapperProps = FormComponentProps & {
  control?: any;
  controlProps?: string[];
  styleName?: string;
  preserveProps?: boolean;
  showError?: boolean;
  hideLabel?: boolean;
  labelPosition?: 'before' | 'after';
  extraControls?: any;
  [index: string]: any;
};

export function renderEmptyCell(
  props: FormComponentProps & { EmptyCell: any },
  className?: string
) {
  return (
    props.formElement.elements.length === 0 &&
    props.EmptyCell && <props.EmptyCell {...props} className={className} />
  );
}

export const FormConfig: {
  ErrorView?: React.FC<{
    inline: boolean;
    owner: DataSet;
    source: string;
  }>;
} = { ErrorView };

let warned = false;

function renderLabel(props: WrapperProps, label: string) {
  if (!props.hideLabel && (label || props.formElement.props.formAlign)) {
    return (
      <label
        className={props.formElement.props.inline ? nonBreakingLabel : breakingLabel}
        htmlFor={props.formElement.uid}
      >
        {label || '\xa0'}
      </label>
    );
  }
}

export const DynamicComponent: React.FC<WrapperProps> = observer(props => {
  const context = React.useContext(Context);

  // remove the cached properties
  React.useEffect(() => () => {
    eventCache.splice(eventCache.findIndex(c => c.props == props), 1);
  });
  let formElement = props.formElement;
  let currentProps = paintProps(
    props,
    context,
    props.styleName,
    props.controlProps,
    omit(props, omitKeys)
  );
  if (props.preserveProps) {
    currentProps = { ...currentProps, ...props };
  }
  currentProps.key = formElement.uid;

  // we wither display labeled component
  // or no label at all
  const label = getValue(props, context, 'label');
  const labelPosition = props.labelPosition || 'before';

  if (props.showError && !FormConfig.ErrorView && !warned) {
    console.warn(
      'You need to provide "ErrorView" value to "FormConfig" if you want to display errors'
    );
    warned = true;
  }
  if (label) {
    const { onMouseOver, onMouseOut, className, ...rest } = currentProps;
    return (
      <ErrorBoundary>
        <div
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          className={className}
          data-control={currentProps['data-control'] + 'Wrapper'}
        >
          {labelPosition === 'before' && renderLabel(props, label)}
          {React.createElement(props.control || 'div', rest, props.children)}
          {labelPosition === 'after' && renderLabel(props, label)}
          {props.extraControls}
        </div>

        {props.showError && FormConfig.ErrorView && (
          <FormConfig.ErrorView
            inline={!!formElement.props.inline}
            owner={props.owner}
            source={valueSource(formElement)}
          />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {React.createElement(
        props.control || 'div',
        currentProps,
        props.children || createComponents(props)
      )}
      {props.extraControls}
      {props.showError && FormConfig.ErrorView && (
        <FormConfig.ErrorView
          inline={!!formElement.props.inline}
          owner={props.owner}
          source={valueSource(formElement)}
        />
      )}
    </ErrorBoundary>
  );
});

DynamicComponent.displayName = 'DynamicControl';
