import { generateUid } from './editor_common';
import {
  formDatasetToJS,
  schemaDatasetToJS,
  IProject,
  IStorage,
  ProjectDataSet,
  toJS,
  ls
} from '@toryjs/ui';

type Builder = (project: IProject) => ProjectDataSet;

export class ProjectManager {
  static LAST = 'CORPIX_LAST_PROJECT';

  storage: IStorage;

  // projectHandlers: string[];
  private project: IProject;
  private buildProject: Builder;

  // dataSource: any;

  // @computed get data() {
  //   if (!this.dataSource) {
  //     this.recomputeData();
  //   }
  //   // subscribe
  //   this.dataVersion;

  //   return this.dataSource;
  // }

  // @action recomputeData() {
  //   const data = toJS(this.dataSource);
  //   const dataSet = datasetToJS(this.currentProject.schema);

  //   try {
  //     this.dataSource = this.project ? buildDataSet(dataSet, data) : null;
  //   } catch (ex) {
  //     alert('Data is no longer valid, needed to remove temporary data');
  //     this.dataSource = this.project ? buildDataSet(dataSet) : null;
  //   }
  //   this.dataVersion++;
  // }

  constructor(storage: IStorage, builder: Builder) {
    this.storage = storage;
    this.buildProject = builder;
  }

  listProjects(): Promise<IProject[]> {
    return this.storage.listProjects();
  }

  loadLastProject(): Promise<ProjectDataSet> {
    let last = ls.getItem(ProjectManager.LAST);
    if (last) {
      return this.loadById(last);
    }
    return null;
  }

  async loadById(id: string, saveLast = false): Promise<ProjectDataSet> {
    let project = await this.storage.loadProject(id);
    return this.load(project, saveLast);
  }

  load(project: IProject, saveLast = false) {
    this.project = project;

    if (saveLast) {
      ls.setItem(ProjectManager.LAST, project.uid);
    }

    return this.buildProject(project);
  }

  duplicateProject(project: ProjectDataSet, name: string): ProjectDataSet {
    let newProject = this.saveProject(project, generateUid(), name);
    return this.load(newProject);
  }

  saveProject(project: ProjectDataSet, id?: string, name?: string): IProject {
    const form = toJS(project.form) as any;
    if (name) {
      form.name = name;
    }
    return this.save({
      form: formDatasetToJS(form),
      schema: schemaDatasetToJS(project.schema, false),
      style: {},
      // id: id || this.project.id,
      uid: id || this.project.uid,
      created: this.project.created,
      modified: Date.now()
    });
  }

  save(project: IProject): IProject {
    this.storage.saveProject(project);
    this.project = project;

    ls.setItem(ProjectManager.LAST, this.project.uid);

    return project;
  }

  deleteProject(id: string) {
    this.storage.deleteProject(id);

    if (this.project.uid === id) {
      this.project = null;
      ls.removeItem(ProjectManager.LAST);
    }
  }

  createProject(name: string): ProjectDataSet {
    const uid = generateUid();
    return this.load({
      form: {
        control: 'Form',
        props: {
          label: name,
          control: 'Form'
        },
        elements: []
      },
      schema: {
        type: 'object',
        properties: {}
      },
      style: {},
      uid,
      created: Date.now(),
      modified: null
    });
  }
}
