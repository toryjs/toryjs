import { DataSet, FormElement, JSONSchemaBase } from '@toryjs/form';
import { IMSTMap, ISimpleType } from 'mobx-state-tree';

export type LeftPane = 'pages' | 'data' | 'components' | 'outline' | 'views' | 'all';

type FormElementType = DataSet<FormElement & { id: string }>;
export interface FormDataSet<P = any, C = any, CH = any> extends FormElementType {
  elements: FormDataSet<CH, any>[];
  pages: FormDataSet[];
  props: P;
  controlProps: C;
  parent: FormDataSet<any, CH>;
  isSelected: boolean;
  moveElement(from: FormDataSet, to: FormDataSet, index?: number): void;
}

type SchemaElementType = DataSet<JSONSchemaBase>;
export interface SchemaDataSet extends SchemaElementType {
  uid: string;
  id: string;
  required: string[];
  parent: SchemaDataSet;
  properties: IMSTMap<ISimpleType<SchemaDataSet>>;
  items: SchemaDataSet;
  definitions: IMSTMap<ISimpleType<SchemaDataSet>>;
  reference?: SchemaDataSet;
  imports: IMSTMap<ISimpleType<SchemaDataSet>>;
  oneOf: SchemaDataSet[];
  allOf: SchemaDataSet[];
  anyOf: SchemaDataSet[];
  not: SchemaDataSet;
  changeType(value: string, prev: string): void;
}

export type StateDataSet = {
  readonly selectedSchema: SchemaDataSet;
  readonly selectedSchemaName: string;
  readonly selectedElement: FormDataSet;
  readonly selectedForm: FormDataSet;
  readonly selectedLeftPane: LeftPane;
  setForm(element: FormDataSet): void;
  setSchema(schema: SchemaDataSet, name?: string): void;
  setElement(element: FormDataSet, schema: SchemaDataSet): void;
  deleteActiveSchema(): void;
  deleteActiveElement(): void;
  changeLeftPane(view: LeftPane): void;
};

export interface ProjectDataSet {
  id: string;
  form: FormDataSet;
  schema: SchemaDataSet;
  state: StateDataSet;
  renameSchema(name: string, rootSchema: SchemaDataSet): string;
}
