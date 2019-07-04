import { FormElement, JSONSchema } from '@toryjs/form';

export interface IProject {
  uid?: string;
  form?: FormElement;
  schema?: JSONSchema;
  style?: { [index: string]: string };
  created?: number;
  modified?: number;
}

export interface IStorage {
  listProjects(): Promise<IProject[]>;
  loadProject(id?: string): Promise<IProject>;
  saveProject(project: IProject): Promise<void>;
  deleteProject(id: string): Promise<void>;
}
