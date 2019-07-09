import {
  FormComponentCatalogue,
  EditorComponentCatalogue,
  FormElement,
  buildDataSet,
  JSONSchema,
  FormComponentProps
} from '@toryjs/form';
import { observable, computed, action, toJS } from 'mobx';
import { debounce } from '@tomino/toolbelt';
import { onSnapshot } from 'mobx-state-tree';

import {
  FormDataSet,
  StateDataSet,
  SchemaDataSet,
  ProjectDataSet
} from '../components/editor/definitions';
import { Cache } from './cache';
import { IProject, IStorage } from '../storage/common_storage';
import { schemaDatasetToJS } from '../helpers';

export type Theme = {
  dark: boolean;
  sideMenuColor: string;
  menuColor: string;
  selectedColor: string;
  selectedBackground: string;
  dragBackground: string;
  dragBorder: string;
  pane: string;
  headerBackground: string;
  textColor: string;
  meta: string;
  headerText: string;
  inverted: boolean;
  inputBackground: string;
  buttonBackground: string;
  headerColor: string;
  inputColor: string;
  inputLabel: string;
  borderColor: string;
  invalidColor: string;
  invalidBackground: string;
  label: string;
  inputBorder: string;
};

interface IProjectManager {
  storage: IStorage;
  loadLastProject: Function;
  loadById(id: string): Promise<ProjectDataSet>;
  load(project: IProject, saveLast: boolean): ProjectDataSet;
  saveProject(project: ProjectDataSet): void;
  duplicateProject(project: ProjectDataSet, name: string): ProjectDataSet;
  createProject(name: string): ProjectDataSet;
  deleteProject(id: string): void;
  listProjects(): Promise<IProject[]>;
}

interface ISchemaRecord {
  id: string;
  name: string;
  description: string;
  schema: JSONSchema;
}

export class EditorContext {
  static LAST = 'CORPIX_LAST_PROJECT';

  recomputeDataBounce = debounce(() => this.recomputeData(), 500);

  componentCatalogue: FormComponentCatalogue;
  editorCatalogue: EditorComponentCatalogue;

  @observable.shallow project: ProjectDataSet;
  form: FormDataSet;
  schema: SchemaDataSet;
  state: StateDataSet;

  manager: IProjectManager;
  cache: Cache;

  dragItem: any;
  dataSource: any;
  handlers: any;
  hoverParent: FormElement;
  leftPanelConfig = [true, true];

  selectedDataSetTab = 'dataset';
  selectedParent: FormDataSet;
  selectedParentSchema: SchemaDataSet;
  selectedSourcePath: string = null;
  props: {
    [index: string]: FormComponentProps;
  } = {};

  types: ISchemaRecord[];
  theme: Theme;
  undoManager: {
    undo(): void;
    redo(): void;
  };

  @observable editorVersion = 0;
  @observable projectHandlers: string[];
  @observable help: string = '';
  @observable dataVersion = 0;
  @observable dataPreview = '';
  @observable previewOpen = false;

  constructor(
    componentCatalogue: FormComponentCatalogue = null,
    editorCatalogue: EditorComponentCatalogue = null,
    handlers: any = {},
    types: ISchemaRecord[] = [],
    theme: Theme
  ) {
    this.componentCatalogue = componentCatalogue;
    this.editorCatalogue = editorCatalogue;
    this.handlers = handlers;
    this.types = types;
    this.theme = theme;
    this.types = types;
    this.cache = new Cache();

    if (handlers) {
      this.projectHandlers = Object.getOwnPropertyNames(handlers).sort();
    }
  }

  init(manager: IProjectManager) {
    this.manager = manager;
  }

  async loadLastProject() {
    if (this.manager.storage) {
      this.project = await this.manager.loadLastProject();
    }
    return this.project;
  }

  async loadProject(project: IProject, saveLast = true) {
    this.project = this.manager.load(project, saveLast);

    onSnapshot(this.project.schema, this.recomputeDataBounce);
  }

  load(project: IProject, saveLast = true) {
    this.project = this.manager.load(project, saveLast);

    onSnapshot(this.project.schema, this.recomputeDataBounce);
  }

  duplicateProject(name: string) {
    this.project = this.manager.duplicateProject(this.project, name);
  }

  createProject(name: string) {
    this.project = this.manager.createProject(name);
  }

  @computed get data() {
    if (!this.dataSource) {
      this.recomputeData();
    }
    // subscribe
    this.dataVersion;

    return this.dataSource;
  }

  @action recomputeData() {
    const data = toJS(this.dataSource);
    const dataSet = schemaDatasetToJS(this.schema, false);

    try {
      this.dataSource = this.project ? buildDataSet(dataSet, data, false) : null;
    } catch (ex) {
      alert('Data is no longer valid, needed to remove temporary data');
      this.dataSource = this.project ? buildDataSet(dataSet, {}, false) : null;
    }
    this.dataVersion++;
  }
}
