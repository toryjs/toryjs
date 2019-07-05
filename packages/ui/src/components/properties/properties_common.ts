import { FormComponentProps } from '@toryjs/form';

import { InputProps, DropdownProps } from 'semantic-ui-react';
import { prop } from '../../common';
import { EditorContextType } from '../../editor/editor_context';
import { getValue, setValue, isNullOrEmpty } from '../../helpers';

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
  editorState: EditorContextType,
  resolveBoundProperty = false,
  propName: keyof T = undefined
) {
  let value = getValue(
    props,
    editorState,
    propName,
    undefined,
    props.extra ? `.${props.extra}` : ''
  );

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
    error: prop(props.formElement) ? props.owner.getError(prop(props.formElement)) : null
  };
}

export function onChangeHandler(
  this: { props: FormComponentProps; editorState: EditorContextType; propName?: string },
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
    this.editorState,
    currentValue,
    this.propName,
    this.props.extra ? `.${this.props.extra}` : ''
  );
}

export function clearHandler(this: React.Component<FormComponentProps>) {
  setValue(this.props, null, '');
}
