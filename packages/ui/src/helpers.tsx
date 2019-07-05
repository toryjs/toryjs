import {
  FormComponentCatalogue,
  EditorComponentCatalogue,
  JSONSchema,
  FormElement,
  DataSet,
  FormComponentProps,
  Handlers
} from '@toryjs/form';
import React from 'react';
import { toJS } from 'mobx';
import { BoundProp, CommonPropNames } from '@toryjs/form';
import { ContextType, Context } from './context';

export function merge(...catalogues: EditorComponentCatalogue[]): EditorComponentCatalogue;
export function merge(...catalogues: FormComponentCatalogue[]): FormComponentCatalogue;
export function merge(...catalogues: any[]): any {
  if (!catalogues.some(c => c.createComponent)) {
    throw new Error('The catalogue needs to define a createComponent function!');
  }
  return {
    isEditor: catalogues.some(c => c.isEditor),
    createComponent: catalogues.find(c => c.createComponent).createComponent,
    cssClass: catalogues.map(c => (c.cssClass ? c.cssClass + ' ' : '')).join(''),
    components: Object.assign({}, ...catalogues.map(c => c.components)) as any
  };
}

export const ls =
  typeof window == 'undefined'
    ? {
      getItem() {},
      setItem() {}
    }
    : window.localStorage;

const composites = ['definitions', 'properties', 'items'];

export function schemaDatasetToJS(schema: any, faker = true): JSONSchema {
  let result = cleanSchemaDataset(toJS(schema), faker);
  if (!result) {
    return null;
  }
  if (result.type === 'object' && !result.properties) {
    result.properties = {};
  }
  return result;
}

export function createComponents(props: FormComponentProps, className: string = null) {
  if (!props.formElement.elements || props.formElement.elements.length === 0) {
    if ((props as any).dangerouslySetInnerHTML) {
      return undefined;
    }
    return props.catalogue.isEditor &&
      (props.catalogue.components[props.formElement.control] as any).provider ? (
        <div>Component has no children 🤨</div>
      ) : null;
  }
  return props.formElement.elements.map((e, i) => (
    <React.Fragment key={i}>
      {props.catalogue.createComponent(
        { ...props, className: '' },
        e,
        className
        // extraProps
        // null,
        // onClick ? onClick(props) : undefined
      )}
    </React.Fragment>
  ));
}

export function formDatasetToJS(form: FormElement) {
  return cleanForm(toJS(form));
}

function cleanForm(form: any) {
  if (!form) {
    return null;
  }
  let result: any = {};
  for (let key of Object.getOwnPropertyNames(form)) {
    if (key === 'parent' || key === 'isSelected') {
      continue;
    }
    let value = form[key];

    if (Array.isArray(value)) {
      if (value.length > 0) {
        result[key] = value.map(v => (typeof v === 'object' ? cleanForm(v) : v));
      }
    } else if (value != null && typeof value === 'object') {
      if (Object.getOwnPropertyNames(value).length > 0) {
        result[key] = cleanForm(value);
      }
    } else if (value) {
      result[key] = value;
    }
  }
  if (Object.keys(result).length === 0) {
    return undefined;
  }
  return result;
}

function cleanSchemaDataset(schema: any, faker: boolean): JSONSchema {
  const cleaned: any = {};

  if (schema == null) {
    return;
  }

  let keys = Object.getOwnPropertyNames(schema || {});
  for (let key of keys) {
    let value = schema[key];
    // match
    if (value == null || value === '') {
      continue;
    }

    if (key === 'errors' || key === 'imports' || typeof schema[key] === 'function') {
      // do nothing
    } else if (key === 'reference') {
      if (faker) {
        cleaned.properties = cleanSchemaDataset(schema.reference.properties, faker);
      }
      // else {
      //   cleaned.reference = schema.$ref.split('/').pop();
      // }
    } else if (composites.indexOf(key) >= 0) {
      if ((faker || !schema.$ref) && value && Object.getOwnPropertyNames(value).length > 0) {
        cleaned[key] = cleanSchemaDataset(schema[key], faker);
      }
    } else if (key === '$enum') {
      if (schema.$enum.length > 0) {
        cleaned.enum = schema.$enum.map((e: any) => e.value);
        cleaned.$enum = schema.$enum.map((e: any) => ({
          text: e.text,
          value: e.value,
          icon: e.icon
        }));
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        cleaned[key] = value.map(v => (typeof v === 'object' ? cleanSchemaDataset(v, faker) : v));
      }
    } else if (typeof value === 'object') {
      if (Object.getOwnPropertyNames(value).length > 0) {
        cleaned[key] = cleanSchemaDataset(value, faker);
      }
    } else {
      cleaned[key] = value;
    }
  }

  if (faker) {
    if (schema.properties) {
      cleaned.required = Object.getOwnPropertyNames(schema.properties);
    }
  }
  return cleaned;
}

export function simpleHandle<T>(
  props: FormComponentProps,
  handleName: string,
  context: T,
  args?: any
) {
  return handle(props.handlers, handleName, props.owner, props, props.formElement, context, args);
}

export function handle<T, U>(
  handlers: Handlers<DataSet<T>, U>,
  handle: string | number | symbol,
  owner: DataSet<T>,
  props: FormComponentProps<T>,
  formElement: FormElement<T>,
  context: U,
  args?: any
) {
  if (!handlers[handle as string]) {
    console.error('Handler does not exist: ' + (handle as string));
    return;
  }
  return handle && handlers[handle as string]
    ? handlers[handle as string]({ owner, props, formElement, context, args })
    : null;
}

// type ValueType<C> = {
//   formElement: FormElement<C>;
//   handlers: any;
//   owner: DataSet;
// };

export function bindGetValue(props: FormComponentProps, context: ContextType) {
  return function<C>(
    element: FormElement<C>,
    propName?: keyof C | CommonPropNames,
    defaultValue?: any
  ) {
    return getPropValue(props, element, context, propName, defaultValue);
  };
}

export function getValues<C>(
  props: FormComponentProps<C>,
  ...propNames: (keyof C | CommonPropNames)[]
): any[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = React.useContext(Context);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // return React.useMemo(
  //   () => propNames.map(p => getPropValue(props, props.formElement, context, p)),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [context, props.formElement]
  // );
  return propNames.map(p => getPropValue(props, props.formElement, context, p));
}

export function getValue<C>(
  props: FormComponentProps<C>,
  context: ContextType,
  propName?: keyof C | CommonPropNames,
  defaultValue?: any,
  path: string = ''
): any {
  return getPropValue(props, props.formElement, context, propName, defaultValue, path);
}
export function getPropValue<C>(
  props: FormComponentProps<C>,
  formElement: FormElement<C>,
  context: ContextType,
  propName: keyof C | CommonPropNames = undefined,
  defaultValue: any = undefined,
  path = ''
) {
  if (!propName) {
    propName = 'value' as any;
  }
  let prop: BoundProp = formElement.props ? (formElement.props as any)[propName] : null;
  if (prop == null) {
    return defaultValue;
  }
  if (typeof prop !== 'object' || Array.isArray(prop)) {
    return prop; // props.owner.getValue(prop);
  }
  if (prop.value != null) {
    return prop.value;
  } else if (prop.handler) {
    return handle(props.handlers, prop.handler, props.owner, props, props.formElement, context);
  } else if (prop.source) {
    if (prop.source === 'dataPropFirst') {
      return props.dataProps && props.dataProps.first;
    } else if (prop.source === 'dataPropData') {
      return props.dataProps && props.dataProps.data;
    }
    return props.owner.getValue
      ? props.owner.getValue(prop.source + path)
      : props.owner[prop.source];
  }
  return defaultValue === null ? '' : defaultValue;
}

export function safeGetValue<C>(
  props: FormComponentProps<C>,
  context: any,
  propName: keyof C = null,
  defaultValue: any = null
) {
  let value = getValue(props, context, propName, defaultValue);
  if (value == null) {
    return value;
  }
  return value.toString();
}

export function setValue<C>(
  props: FormComponentProps<C>,
  context: any,
  value: any,
  propName: keyof C = undefined,
  path = ''
) {
  setPropValue(props, props.owner, context, value, propName, path);
}

export function setPropValue<C>(
  props: FormComponentProps<C>,
  owner: DataSet<C>,
  context: any,
  value: any,
  propName: keyof C = undefined,
  path = ''
) {
  if (!propName) {
    propName = 'value' as any;
  }
  let prop: BoundProp = props.formElement.props[propName];
  if (prop == null) {
    return;
  }

  if (propName === 'dataPropFirst' || propName === 'dataPropData') {
    // TODO: Investigate how to solve this systematically
    return;
  }

  if (typeof prop !== 'object') {
    owner.setValue(propName as string, value);
  }

  if (prop.parse) {
    handle(props.handlers, prop.parse, props.owner, props, props.formElement, context, {
      current: value,
      previous: getValue(props, context, propName)
    });
    return;
  }

  // if (prop.validate) {
  //   let error = handle(props.handlers, prop.validate, props.owner, props, context, value);
  //   if (error) {
  //     return error;
  //   }
  // }

  if (prop.source) {
    owner.setValue(
      prop.source,
      path ? { [path.substring(1)]: value } : value,
      prop.validate ? (props.handlers[prop.validate] as any) : undefined
    );
  } else if (prop.handler) {
    handle(props.handlers, prop.handler, props.owner, props, context, value);
  }
}

export function prop<C>(
  formElement: FormElement<C>,
  propName: keyof C = 'value' as any,
  type: 'source' | 'value' | 'handler' = 'source'
) {
  return formElement && formElement.props && formElement.props[propName]
    ? (formElement.props as any)[propName][type]
    : null;
}

export function isNullOrEmpty(val: any) {
  return val == null || val == '';
}

export function valueSource<C extends { value: BoundProp }>(formElement: FormElement<C>) {
  return prop(formElement, 'value', 'source');
}

export function valueHandler<C extends { value: BoundProp }>(formElement: FormElement<C>) {
  return prop(formElement, 'value', 'handler');
}

export function value<C extends { value: BoundProp }>(formElement: FormElement<C>) {
  return prop(formElement, 'value', 'value');
}

export function stripUid(obj: any) {
  if (obj.uid) {
    delete obj.uid;
  }

  for (let key of Object.keys(obj)) {
    let property = obj[key];
    if (property == null) {
      continue;
    }
    if (property.uid) {
      delete property.uid;
    }
    if (Array.isArray(property)) {
      for (let e of property) {
        stripUid(e);
      }
    } else if (typeof property === 'object') {
      stripUid(property);
    }
  }
  return obj;
}

export function clone(dataset: DataSet) {
  return stripUid(formDatasetToJS(dataset));
}

export function parseProps(props: FormComponentProps, context: ContextType) {
  const value = getValue(props, context, undefined, undefined) || '';

  const controlSource = valueSource(props.formElement);

  let error = '';
  let disabled = false;

  const label = getValue(props, context, 'label');

  // we will only process the values if the schma exists
  if (controlSource !== '' && props.owner.getSchema(controlSource, false) != null) {
    error = controlSource ? props.owner.getError(controlSource) : null;
    disabled = props.readOnly || (controlSource && props.owner.getSchema(controlSource).readOnly);
  }

  return { value, label, error, disabled };
}

export function processControl(props: FormComponentProps, createCallback: boolean = true) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = React.useContext(Context);
  const { formElement, owner } = props;
  let handleChange: any;
  if (createCallback) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    handleChange = React.useCallback(
      (e: React.SyntheticEvent<any>, uiProps: any) => {
        const source = valueSource(formElement);
        if (!source) {
          return;
        }
        setValue(
          props,
          context,
          uiProps && uiProps.checked != null
            ? uiProps.checked
            : uiProps && uiProps.value != null
              ? uiProps.value
              : e.currentTarget.type === 'checkbox'
                ? e.currentTarget.checked
                : e.currentTarget.value
        );

        const changeHandler = props.formElement.props.onChange;
        if (changeHandler) {
          simpleHandle(props, changeHandler, context);
        }
      },
      [context, formElement, props]
    );
  }

  const { error, value, disabled } = parseProps(props, context);
  const source = valueSource(formElement);

  return {
    context,
    owner,
    formElement,
    error,
    value,
    disabled,
    source,
    handleChange,
    controlProps: formElement.props
  };
}
