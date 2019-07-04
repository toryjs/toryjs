import { IProject, IStorage } from './common_storage';

export class LocalStorage implements IStorage {
  key: string;

  constructor(key = 'CORPIX_PROJECTS') {
    this.key = key;
  }

  listProjects(): Promise<IProject[]> {
    let raw = localStorage.getItem(this.key);
    if (raw) {
      return Promise.resolve(JSON.parse(raw));
    }
    return Promise.resolve([]);
  }

  async loadProject(id?: string): Promise<IProject> {
    let projects = await this.listProjects();
    if (id == null) {
      return (projects || [])[0];
    }
    return projects.find(p => p.uid === id);
  }

  async deleteProject(id: string) {
    let projects = await this.listProjects();
    let index = projects.findIndex(p => p.uid === id);
    if (index >= 0) {
      projects.splice(index, 1);
    }
    localStorage.setItem(this.key, JSON.stringify(projects));
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
    localStorage.setItem(this.key, JSON.stringify(projects));
  }
}
