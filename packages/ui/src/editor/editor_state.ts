/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  FormElement,
  FormComponentCatalogue,
  EditorComponentCatalogue,
  EditorComponent
} from '@toryjs/form';
import { onSnapshot } from 'mobx-state-tree';

import { CellHighlighter } from './form/cell_highlighter';
import { observable, computed, action } from 'mobx';
import { toJS } from '../common';
import { buildDataSet } from '@toryjs/form';
import { debounce } from '@tomino/toolbelt';
import { ProjectManager } from './project_manager';
import { SchemaRecord } from './editor_types';
import { prepareStores } from './form_store';
import { schemaSchema } from './common_schemas';
import { schemaDatasetToJS } from '../helpers';
import { IStorage, IProject } from '../storage/common_storage';
import { Theme } from './themes/common';
import { white } from './themes/white';
import { black } from './themes/black';

type Builder = (project: IProject) => DynamicForm.ProjectDataSet;

let id = 0;

export class EditorState {
  static LAST = 'CORPIX_LAST_PROJECT';

  __id = id++;
  _dragItem: any;

  get dragItem() {
    return this._dragItem;
  }
  set dragItem(v) {
    this._dragItem = v;
  }

  buildProject: Builder;
  componentCatalogue: FormComponentCatalogue;
  dataSource: any;
  editorCatalogue: EditorComponentCatalogue;
  form: DynamicForm.FormDataSet;
  handlers: any;
  highlighter: CellHighlighter;
  hoverParent: FormElement;
  leftPanelConfig = [true, true];
  manager: ProjectManager;

  schema: DynamicForm.SchemaDataSet;
  state: DynamicForm.StateDataSet;
  selectedDataSetTab = 'dataset';
  selectedParent: DynamicForm.FormDataSet;
  selectedParentSchema: DynamicForm.SchemaDataSet;
  selectedSourcePath: string = null;
  tabSelection: { [index: string]: any } = {};
  types: SchemaRecord[];
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
  @observable.shallow project: DynamicForm.ProjectDataSet;

  // standard app context

  alert: any = null;
  authToken: string = null;
  auth = observable({ user: null });
  app = {};

  private _cachedProps: { [index: string]: FormElement[] } = {};
  private _cachedChildProps: { [index: string]: FormElement[] } = {};

  constructor(
    componentCatalogue: FormComponentCatalogue = null,
    editorCatalogue: EditorComponentCatalogue = null,
    handlers: any = {},
    types: SchemaRecord[] = [],
    storage: IStorage = null,
    theme: string = 'dark'
  ) {
    this.componentCatalogue = componentCatalogue;
    this.editorCatalogue = editorCatalogue;
    this.handlers = handlers;
    this.types = types;
    this.theme = theme === 'light' ? white : black;

    this.types = (types || []).concat(
      {
        id: 'schema',
        name: 'Schema',
        description: 'Schema of the schema definition',
        schema: schemaSchema
      }
      // {
      //   id: 'form',
      //   name: 'Form',
      //   description: 'Schema of the form definition',
      //   schema: elementSchema(true)
      // }
    );

    this.buildProject = prepareStores(this);
    this.manager = new ProjectManager(storage, this.buildProject);

    if (handlers) {
      this.projectHandlers = Object.getOwnPropertyNames(handlers).sort();
    }
  }

  async loadLastProject() {
    if (this.manager.storage) {
      this.project = await this.manager.loadLastProject();
    }
    return this.project;
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

  recomputeDataBounce = debounce(() => this.recomputeData(), 500);

  highlight(
    highlighter: CellHighlighter,
    row: number,
    column: number,
    className: string,
    width: number = 1,
    clear = true
  ) {
    if (clear && this.highlighter) {
      this.highlighter.clearHighlight();
    }
    this.highlighter = highlighter;
    this.highlighter.highlight(row, column, className, width);
  }

  highlightMultiple(
    highlighter: CellHighlighter,
    cells: { row: number; column: number; className: string }[]
  ) {
    if (this.highlighter) {
      this.highlighter.clearHighlight();
    }
    this.highlighter = highlighter;
    this.highlighter.highlightMultiple(cells);
  }

  changeTab(from: string, to: string) {
    this.tabSelection[from] = {
      schema: this.project.state.selectedSchema,
      name: this.project.state.selectedSchemaName
    };
    if (this.tabSelection[to]) {
      this.project.state.setSchema(this.tabSelection[to].schema, this.tabSelection[to].name);
    }
    this.selectedDataSetTab = to;
  }

  cachedProps(element: EditorComponent) {
    if (!element.props) {
      return [];
    }
    if (!this._cachedProps[element.control]) {
      this._cachedProps[element.control] = Object.keys(element.props).map(
        key => element.props[key].control
      );
    }
    return this._cachedProps[element.control];
  }

  cachedChildProps(element: EditorComponent) {
    if (!element.childProps) {
      return [];
    }
    if (!this._cachedChildProps[element.control]) {
      this._cachedChildProps[element.control] = Object.keys(element.childProps).map(
        key => element.childProps[key].control
      );
    }
    return this._cachedChildProps[element.control];
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

  editorProps: FormElement[] = [
    {
      group: 'Editor',
      control: 'Input',
      props: { value: { source: 'editorLabel' }, label: 'Label' }
    },
    {
      group: 'Editor',
      control: 'Checkbox',
      props: { checked: { source: 'locked' }, label: 'Locked' }
    }
  ];
}
