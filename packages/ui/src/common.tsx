import React from 'react';
import names from 'classnames';

import { interpolate } from '@tomino/toolbelt';
import { DataSet, FormElement, FormComponentProps, FormComponent } from '@toryjs/form';
import { BoundProp, BoundType } from '@toryjs/form';

import { css } from 'emotion';
import { toJS as mobxToJs } from 'mobx';
export { default as names } from 'classnames';

import { getPropValue } from './helpers';
import { ContextType } from './context';

export { Theme } from './editor/themes/common';
export { Context } from './context';
export {
  handle,
  getValue,
  isNullOrEmpty,
  prop,
  processControl,
  valueSource,
  createComponents
} from './helpers';
export { DynamicComponent as DynamicControl, paintProps } from './components/dynamic_component';

export const select = css`
  .react-select__control {
    border: 0px;
    border-radius: 0 !important;
    min-height: 23px;
  }

  .react-select__indicators {
    height: 23px;
  }

  .react-select__indicator {
    padding: 2px;
  }

  .react-select__value-container {
    height: 23px;

    > div {
      /* position: absolute; */
      margin: 0px;
      padding: 0px;
    }
  }

  .react-select__single-value {
    margin-top: 0px;
  }

  .react-select__menu {
    border-radius: 0px;
    margin-top: 2px;
  }

  label: select;
`;

export const fieldSet = css`
  /* name: fieldset */
  border: solid 1px #ddd;
  border-radius: 5px;
  background-color: #fafafa;

  legend {
    padding: 0px 6px;
    font-weight: bold;
  }
`;

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

export const fullWidth = css`
  width: 100%;
`;

export const noPadding = css`
  padding: 0px !important;
`;

export const marginLess = css`
  margin: 0px !important;
`;

export const pointer = css`
  cursor: pointer !important;
  label: pointer;
`;

export const error = css`
  background: red;
  padding: 3px;
  border-radius: 3px;
  font-weight: bold;
  color: white;
`;

export type SignatureType = {
  comment: string;
  signature: string;
  verifiedState: 'Pending' | 'Verified' | 'Rejected';
  rejected?: boolean;
  uid: string;
  name: string;
  date: Date;
  setValue?(name: string, value: any): any;
};

export type SignatureHandlers = {
  validateForm(): boolean;
  verifySignature(owner: any, args: { uid: string; signature: string }): Promise<string>;
  sign(
    owner: DataSet,
    args: {
      source: string;
      reject: boolean;
      password: string;
      reason: string;
      submit: boolean;
    }
  ): Promise<SignatureType>;
  signatureFont(): string;
};

export type FormEditorProps = {
  formElement: DynamicForm.FormDataSet;
  formData: DataSet;
  handlers?: { [index: string]: any };
  readOnly: boolean;
};

export function parseFromOwner(str: string, owner: DataSet) {
  try {
    return interpolate(str, owner);
  } catch (ex) {
    return 'Error parsing string: ' + ex.message;
  }
}

export function sourceValue(prop: BoundProp) {
  return prop ? (prop as BoundType).source : null;
}

export function handlerValue(prop: BoundProp) {
  return prop ? (prop as BoundType).handler : null;
}

// let onClick: (props: FormComponentProps) => Function;
// export function registerOnClick(onClickHandler: typeof onClick) {
//   onClick = onClickHandler;
// }

export function root(formElement: FormElement) {
  let root = formElement;
  while (root.parent != null && (!root.pages || root.pages.length === 0)) {
    root = root.parent;
  }
  return root;
}

const extraProps = ['editorLabel'];

export function cleanProps(props: any) {
  const result: any = {};
  const js = toJS(props);
  for (let key of Object.keys(js)) {
    if (js[key] === '' || js[key] == null || js[key].length === 0 || extraProps.indexOf(key) >= 0) {
      continue;
    }
    result[key] = js[key];
  }
  return result;
}

export function tryInterpolate(text: string, owner: DataSet) {
  try {
    return interpolate(text, owner);
  } catch (ex) {
    return 'Error: ' + ex.message;
  }
}

export function useMergeState<T>(initialState: T): [T, (t: Partial<T>) => void] {
  const [state, setState] = React.useState(initialState);
  const setMergedState = (newState: any) =>
    setState((prevState: any) => Object.assign({}, prevState, newState));
  return [state, setMergedState];
}

// export function createComponents(props: FormComponentProps, className: string = null) {
//   if (!props.formElement.elements || props.formElement.elements.length === 0) {
//     return undefined;
//   }
//   return props.formElement.elements.map((e, i) => (
//     <React.Fragment key={i}>
//       {props.catalogue.createComponent(
//         { ...props, className: '' },
//         e,
//         className
//         // extraProps
//         // null,
//         // onClick ? onClick(props) : undefined
//       )}
//     </React.Fragment>
//   ));
// }

// type Options = {
//   drawLabel?: boolean;
//   className?: string;
//   onClick?: any
// }

export function createComponent1(
  props: FormComponentProps,
  formElement: FormElement,
  context: ContextType,
  className?: string,
  extraProps?: any
) {
  if (!formElement || formElement.control === 'EditorCell') {
    return null;
  }

  if (props.catalogue.components[formElement.control] === undefined) {
    return <div className={names(className, error)}>{formElement.control}</div>;
  }

  const hide = getPropValue(props, formElement, context, 'hidden', false);
  if (hide) {
    return null;
  }

  const controlDefinition = props.catalogue.components[formElement.control];
  const Control =
    (controlDefinition as FormComponent).Component ||
    (controlDefinition as React.ComponentType<any>);

  Control.displayName = 'CreateComponentWrapper';

  // TODO: Make this type safe by creating a render method in catalogue
  let renderedControl = (
    <Control
      owner={props.owner}
      className={className}
      handlers={props.handlers}
      catalogue={props.catalogue}
      formElement={formElement}
      extra={{ ...props.extra, ...extraProps }}
      dataProps={props.dataProps}
    />
  );

  return renderedControl;
}

export function toJS<T>(obj: T): T {
  return mobxToJs(obj);
}

export function addProviders(mainForm: FormElement, form: FormElement) {
  let formElement = form;

  // add all root providers from the man form
  if (form !== mainForm) {
    let model = toJS(mainForm);
    let provider = model;

    while (
      provider.elements &&
      provider.elements.length &&
      provider.elements[0].control.indexOf('Provider') >= 0
    ) {
      provider = provider.elements[0];
    }

    if (provider != model) {
      provider.elements = [form];
      formElement = model;
    }
  }

  return formElement;
}

// export function props<T>(props: T, defaultProps?: Partial<T>): T {
//   return controlProps || (defaultProps as any) || {};
// }
