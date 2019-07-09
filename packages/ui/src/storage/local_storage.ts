import { IProject, IStorage } from './common_storage';
import { ls } from '../helpers';

export class LocalStorage implements IStorage {
  key: string;
  projects: { [index: string]: IProject } = {};
  project: IProject;

  constructor(key = 'CORPIX_PROJECTS') {
    this.key = key;
  }

  listProjects(): Promise<IProject[]> {
    let raw = ls.getItem(this.key);
    if (raw) {
      return Promise.resolve(JSON.parse(raw));
    }
    return Promise.resolve([]);
  }

  async loadProject(id: string = 'default'): Promise<IProject> {
    let projects = await this.listProjects();
    if (id == null) {
      return (projects || [])[0];
    }
    let project = projects.find(p => p.uid === id);

    if (!project) {
      project = {
        uid: id,
        form: {},
        schema: { type: 'object', properties: {} }
      };
    }

    this.projects[id] = project;
    this.project = project;

    return project;
  }

  async deleteProject(id: string) {
    let projects = await this.listProjects();
    let index = projects.findIndex(p => p.uid === id);
    if (index >= 0) {
      projects.splice(index, 1);
    }
    ls.setItem(this.key, JSON.stringify(projects));
  }

  async saveProject(project: IProject): Promise<void> {
    let projects = await this.listProjects();
    let index = projects.findIndex(p => p.uid === project.uid);
    project.modified = Date.now();

    if (index >= 0) {
      projects.splice(index, 1, project);
    } else {
      projects.push(project);
    }
    ls.setItem(this.key, JSON.stringify(projects));
  }
}
