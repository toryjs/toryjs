import * as React from 'react';

import { DataSet } from './form_store';
import { JSONSchema } from './json_schema';

export type HandlerArgs<O = any, CTX = any, ARGS = any, P = any, D = any, CH = any> = {
  owner?: DataSet<O>;
  props?: FormComponentProps<P, D, CH>;
  formElement?: FormElement;
  context?: CTX;
  args?: ARGS;
};

export type Handler<O = any, CTX = any, ARGS = any, P = any, D = any, CH = any> = (
  args?: HandlerArgs<O, CTX, ARGS, P, D, CH>
) => any;

export type Handlers<O, CTX> = {
  [index: string]: Handler<O, CTX>;
};

type ParseArgs = {
  current: any;
  previous: any;
};
export type ParseHandler<O, CTX, ARGS = {}> = Handler<O, CTX, ParseArgs & ARGS>;

type ValidateArgs = {
  value: any;
  source: string;
};
export type ValidateHandler<T, U, V = {}> = Handler<T, U, ValidateArgs & V>;

export type FormComponentProps<P = any, CH = any, O = any> = {
  className?: string;
  catalogue: FormComponentCatalogue;
  formElement: FormElement<P, CH>;
  handlers?: Handlers<O, any>;
  owner: DataSet<O>;
  readOnly?: boolean;
  extra?: any;
  dataProps?: any;
  uid?: string;
  // renderControl?: (
  //   element: FormElement<O, C>,
  //   props: FormComponentProps<O, C, T>,
  //   ...other: any[]
  // ) => any;
};

export type FormComponent<P = any, CH = any, O = any> = {
  Component: React.ComponentType<FormComponentProps<P, CH, O> & { [index: string]: any }>;
  // manualCss?: boolean;
  toString?(
    owner: DataSet<O>,
    props: FormComponentProps<P, CH>,
    context: any,
    catalogue?: FormComponentCatalogue
  ): string;
  toHtml?(
    owner: DataSet<O>,
    props: FormComponentProps<P, CH>,
    context: any,
    catalogue?: FormComponentCatalogue
  ): string;
};

export type FormComponentCatalogue = {
  components: { [index: string]: FormComponent | React.ComponentType<any> };
  // manualCss?: boolean;
  cssClass: string;
  createComponent?(
    props: FormComponentProps,
    formElement: FormElement,
    context: any,
    className?: string
  ): JSX.Element;
};

export type Option = {
  [index: string]: any;
  text?: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  description?: string;
  type?: string;
};

// [K in keyof T]: Prop;
export type PropMap = { [index: string]: Prop };

export type Prop = {
  control: FormElement;
  schema?: JSONSchema;
  defaultValue?: any;
  // propSource?: 'value' | 'handler' | 'binding';
  // propTarget?: 'control';
  // display?: 'inlineLabel' | 'topLabel' | 'group' | 'padded';
};

export type EditorComponent<P = any, C = any, CH = any, O = any> = {
  Component: React.ComponentType<FormComponentProps<P, CH, O>>;
  props?: PropMap;
  childProps?: PropMap;
  provider?: boolean;
  control: string;
  group?: string;
  icon?: string;
  thumbnail?: {
    light: string;
    dark: string;
  };
  title: string;
  defaultChildren?: FormElement[];
  defaultProps?: { [index: string]: any };
  bound?: boolean;
  events?: boolean;
  handlers?: { [index: string]: Handler<O, any, any, P> };
  valueProvider?: string;
};

export type EditorComponentCatalogue = {
  createComponent?(
    props: FormComponentProps,
    formElement: FormElement,
    className?: string
  ): JSX.Element;
  components: { [index: string]: EditorComponent };
  cssClass: string;
};

export type FormExtension = (props: FormViewProps) => void;

export type FormViewProps = {
  formElement: FormElement;
  extensions?: FormExtension[];
  owner: DataSet;
  catalogue: FormComponentCatalogue;
  handlers?: { [index: string]: any };
  readOnly?: boolean;
};

export type EditorFormViewProps<P, CH, O> = {
  formElement: FormElement<P, CH>;
  owner: DataSet<O>;
  catalogue: FormComponentCatalogue;
  handlers?: { [index: string]: any };
  readOnly?: boolean;
};

type FormProp = {
  [index: string]: string | number | boolean | BoundProp;
};

export type CommonProps = {
  label?: string;
  css?: string;
  className?: string;
};
export type CommonPropNames = keyof CommonProps;

export interface FormElement<P = any, CH = any> {
  uid?: string;
  documentation?: string;
  group?: string;
  tuple?: string;
  tupleOrder?: number;
  // css?: BoundProp;
  // className?: BoundProp;
  control?: string;
  bound?: boolean;
  props?: P & CommonProps;
  // label?: BoundProp;
  parent?: FormElement<any>;
  elements?: FormElement<any, CH>[];
  pages?: FormElement<CH, any>[];
  // editor?: {
  //   label?: string;
  //   locked?: boolean;
  //   template?: number;
  // };
  // visibleHandler?: keyof HA;
  // validateHandler?: keyof HA;
  // parseHandler?: keyof HA;
  // valueHandler?: keyof HA;
  // optionsHandler?: keyof HA;
}

export type BoundType<T = string> = {
  value?: T;
  handler?: string;
  source?: string;
  validate?: string;
  parse?: string;
};

export type BoundProp<T = string> = T | BoundType<T>;

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// type SafeElement<U = any, C = any> = Omit<FormElement<U, C>, 'controlProps'>;

// options?: (owner: DataSet<T>) => Option[];
//     validate?: (value: any, owner: T, source: string) => string | void;
//     visible?: (owner: DataSet<T>) => boolean;
//     parse?: (value: string, prev: any, owner: T) => any;
//     value?: (owner: DataSet<T>, source: string) => any;
