import * as React from 'react';

import { FormElement, DataSet, Handlers, FormComponentCatalogue } from '@toryjs/form';

import { Group } from './group';
import { Input } from './input';
import { Select } from './select';
import { TextArea } from './textbox';
import { Checkbox } from './checkbox';
import { Map } from './map';
import { Value } from './value';
import { TableView } from './table';
import { Tuple } from './tuple';
import { CodeEditor } from './code';
import { EditorContextType } from '../../editor/editor_context';
import { Binding } from './binding';

// import { Map } from './map';
// import { MapTable } from './map_table';

export function renderControl<T>(
  props: {
    formElement: FormElement;
    owner: DataSet<T>;
    handlers?: Handlers<DataSet, EditorContextType>;
    catalogue: FormComponentCatalogue;
    uid: string;
  },
  filter?: string
) {
  if (props.formElement.bound) {
    return <Binding key={props.uid} {...props} />;
  }
  switch (props.formElement.control) {
    case 'Input':
      return <Input key={props.uid} {...props} />;
    case 'Code':
      return <CodeEditor key={props.uid} {...props} />;
    case 'Table':
      return <TableView key={props.uid} {...props} />;
    case 'Value':
      return <Value key={props.uid} {...props} />;
    case 'Group':
      return <Group key={props.uid} {...props} filter={filter} />;
    case 'Select':
      return <Select key={props.uid} {...props} />;
    case 'Tuple':
      return <Tuple key={props.uid} {...props} />;
    case 'Textarea':
      return <TextArea key={props.uid} {...props} />;
    case 'Checkbox':
      return <Checkbox key={props.uid} {...props} />;

    case 'Map':
      return <Map key={props.uid} {...props} />;
    // case 'MapTable':
    //   return <MapTable {...props} />;
    default:
      return <Input key={props.uid} {...props} />;
  }
}
