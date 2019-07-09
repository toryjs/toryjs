import { FormComponentProps } from '@toryjs/form';

import { InputProps, DropdownProps } from 'semantic-ui-react';
import { propName } from '@toryjs/ui';
import { getValue, setValue, isNullOrEmpty, ContextType } from '@toryjs/ui';

export {
  addButton,
  celled,
  controlMargin,
  styledTableRow,
  tableHeader,
  tableRowAuto,
  tableRowFull,
  tableRowWithDelete
} from './properties_styles';

export function parseProps<T, U>(
  props: FormComponentProps<T, U>,
  context: ContextType,
  resolveBoundProperty = false,
  propNamed: keyof T = undefined
) {
  let value = getValue(props, context, propNamed, undefined, props.extra ? `.${props.extra}` : '');

  if (resolveBoundProperty && value && Object.keys(value).indexOf('source') >= 0) {
    if (!isNullOrEmpty(value.value)) {
      value = value.value;
    } else if (!isNullOrEmpty(value.source)) {
      value = value.source;
    } else if (!isNullOrEmpty(value.handler)) {
      value = value.handler;
    } else {
      value = null;
    }
  }

  return {
    props: props.formElement.props,
    value,
    error: propName(props.formElement)
      ? props.owner && props.owner.getError(propName(props.formElement))
      : null
  };
}

export function onChangeHandler(
  this: { props: FormComponentProps; context: ContextType; propName?: string },
  e: React.ChangeEvent<any>,
  sui?: InputProps | DropdownProps
) {
  let currentValue =
    e.currentTarget.type === 'checkbox'
      ? e.currentTarget.checked
      : sui
      ? sui.value
      : e.currentTarget.value;

  // weird hack for dropdown which is not setting the empty value properly
  if (currentValue === '--') {
    currentValue = '';
  }

  setValue(
    this.props,
    this.context,
    currentValue,
    this.propName,
    this.props.extra ? `.${this.props.extra}` : ''
  );
}

export function clearHandler(this: React.Component<FormComponentProps>) {
  setValue(this.props, null, '');
}
