import React from 'react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';
import { StackEditor } from '@toryjs/components-vanilla';

import { observer } from 'mobx-react';
import {
  propGroup,
  boundProp,
  handlerProp,
  tableProp,
  dataProp,
  prop,
  DynamicComponent
} from '@toryjs/ui';
import { Segment } from 'semantic-ui-react';

import { DropdownView } from './dropdown_view';

const templates = [
  { text: 'Component View', value: 'component' },
  { text: 'Items', value: 'items' }
];

const DropdownEditorComponent = (props: FormComponentProps) => {
  const { formElement } = props;
  const template = formElement.props.template;

  const stackedFormElement = React.useMemo(
    () => ({
      ...formElement,
      props: {
        gap: '12px',
        layout: 'column'
      }
    }),
    [formElement]
  );

  if (template == null || template === 'component') {
    return <DropdownView {...props} />;
  }

  return (
    <DynamicComponent {...props}>
      <Segment>
        <StackEditor.Component {...props} formElement={stackedFormElement} />
        {/* <SingleDropCell {...props} /> */}
      </Segment>
    </DynamicComponent>
  );
};

export const DropdownEditor: EditorComponent = {
  Component: observer(DropdownEditorComponent),
  title: 'Dropdown',
  control: 'Dropdown',
  icon: 'caret down',
  group: 'Form',
  props: {
    options: tableProp({ bound: true }, 'Options'),
    ...propGroup('Sources', {
      asyncOptions: handlerProp(),
      value: boundProp(),
      schemaSource: dataProp({
        documentation: 'Dataset path containing the enumeration of list values'
      }),
      filterSource: dataProp({
        documentation:
          'Dataset path used to filter current values. For example, we can have a dataset path "country", store a code of currently selected country.'
      }),
      filterColumn: prop({
        documentation:
          'Enumerator column used to filter current values. For example, we can have an enumerator with columns "value, text, countryCode". As a result we can choose to use the "countryCode" to compare with filter source.'
      }),
      textField: prop({
        documentation:
          'Which field from the target object should be rendered as text. For example, if data contains <i>{ name: "Tomas", uid: "1" }</i>, we can choose to use <i>name<i> as our text field.'
      }),
      valueField: prop({
        documentation:
          'Which field from the target object should be used as value. For example, if data contains <i>{ name: "Tomas", uid: "1" }</i>, we can choose to use <i>uid<i> as our value field.'
      })
    }),
    ...propGroup('Dropdown', {
      additionLabel: boundProp(),
      basic: boundProp({ type: 'boolean' }),
      button: boundProp({ type: 'boolean' }),
      className: boundProp({ type: 'boolean' }),
      clearable: boundProp({ type: 'boolean' }),
      closeOnBlur: boundProp({ type: 'boolean' }),
      closeOnChange: boundProp({ type: 'boolean', default: true }),
      compact: boundProp({ type: 'boolean' }),
      deburr: boundProp({ type: 'boolean' }),
      defaultOpen: boundProp({ type: 'boolean' }),
      direction: boundProp({
        control: 'Select',
        props: { options: [{ text: 'left', value: 'left' }, { text: 'right', value: 'right' }] }
      }),
      error: boundProp({ type: 'boolean' }),
      floating: boundProp({ type: 'boolean' }),
      fluid: boundProp({ type: 'boolean' }),
      header: boundProp({ type: 'boolean' }),
      icon: boundProp({ type: 'boolean' }),
      item: boundProp({ type: 'boolean' }),
      labeled: boundProp({ type: 'boolean' }),
      lazyLoad: boundProp({ type: 'boolean' }),
      loading: boundProp({ type: 'boolean' }),
      multiple: boundProp({ type: 'boolean' }),
      minCharacters: boundProp({ type: 'number' }),
      noResultsMessage: boundProp({ type: 'boolean' }),
      open: boundProp({ type: 'boolean' }),
      openOnFocus: boundProp({ type: 'boolean' }),
      placeholder: boundProp({ type: 'boolean' }),
      pointing: boundProp({ type: 'boolean' }),
      scrolling: boundProp({ type: 'boolean' }),
      search: boundProp({ type: 'boolean' }),
      searchQuery: boundProp({ type: 'boolean' }),
      selectOnBlur: boundProp({ type: 'boolean' }),
      selectOnNavigation: boundProp({ type: 'boolean' }),
      selection: boundProp({ type: 'boolean' }),
      simple: boundProp({ type: 'boolean' }),
      text: boundProp(),
      upward: boundProp({ type: 'boolean' }),
      wrapSelection: boundProp({ type: 'boolean' })
    }),

    ...propGroup('Handlers', {
      onAddItem: handlerProp(),
      onBlur: handlerProp({ type: 'boolean' }),
      onChange: handlerProp({ type: 'boolean' }),
      onClose: handlerProp({ type: 'boolean' }),
      onClick: handlerProp({ type: 'boolean' }),
      onFocus: handlerProp({ type: 'boolean' }),
      onLabelClick: handlerProp({ type: 'boolean' }),
      // onLoadOptions: handlerProp({ type: 'boolean' }),
      onMouseDown: handlerProp({ type: 'boolean' }),
      onOpen: handlerProp({ type: 'boolean' }),
      onSearchChange: handlerProp({ type: 'boolean' }),
      onSearch: handlerProp({ type: 'boolean' })
    }),
    ...propGroup('Editor', {
      template: prop({
        control: 'Select',
        props: {
          default: 'component',
          options: templates
        }
      })
    })
  }
};
