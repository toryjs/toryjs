import { JSONSchema } from '@toryjs/form';

export const ItemTypes = {
  TOOLITEM: 'toolItem',
  DATASET: 'dataSet',
  OUTLINE: 'outline'
};

export type SchemaRecord = {
  id: string;
  name: string;
  description: string;
  schema: JSONSchema;
};
