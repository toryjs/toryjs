import React from 'react';

import { observer } from 'mobx-react';
import { EditorComponent, FormComponentProps } from '@toryjs/form';
import {
  propGroup,
  boundProp,
  handlerProp,
  tableProp,
  dataProp,
  prop,
  DynamicComponent,
  SingleDropCell,
  css
} from '@toryjs/ui';

import { DropdownView, DropdownProps } from './dropdown_view';

const holder = css`
  margin: 6px;
  padding: 6px;
  border: #dedede;
  border-radius: 6px;
`;

const templates = [
  { text: 'Component View', value: 'component' },
  { text: 'Items', value: 'items' }
];

const DropdownEditorComponent = (props: FormComponentProps<DropdownProps>) => {
  const { formElement } = props;
  const template = formElement.props.template;

  if (template == null || template === 'component') {
    return <DropdownView {...props} />;
  }

  return (
    <DynamicComponent {...props}>
      <div className={holder}>
        <SingleDropCell {...props} />
      </div>
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
      asyncOptions: handlerProp({ documentation: 'Handler which loads options asynchronously' }),
      // options: tableProp(
      //   { documentation: 'List of dropdown options containing text and value' },
      //   'Options'
      // ),
      value: boundProp({ documentation: 'Control value' }),
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
    ...propGroup('Editor', {
      template: prop({
        control: 'Select',
        documentation: 'Active editor template',
        props: {
          default: 'component',
          options: templates
        }
      })
    })
  }
};
