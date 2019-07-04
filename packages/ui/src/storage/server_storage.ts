import { IProject, IStorage } from './common_storage';

export class ServerStorage implements IStorage {
  url: string;
  token: string;

  projects: { [index: string]: IProject } = {};
  project: IProject;
  projectId: string;
  projectGroup: string;

  constructor(url: string, projectId: string, projectGroup: string, token = 'jwtToken') {
    this.url = url;
    this.token = token;
    this.projectId = projectId;
    this.projectGroup = projectGroup;
  }

  async listProjects(): Promise<IProject[]> {
    const projects = await fetch(this.url + '/manage', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        action: 'list',
        token: localStorage.getItem(this.token)
      })
    });

    return projects.json();
  }

  async loadProject(id: string = this.projectId || 'default'): Promise<IProject> {
    if (!this.projects[id]) {
      const project = await fetch(
        `${this.url}/load?id=${id}&token=${localStorage.getItem(this.token)}&group=${
          this.projectGroup
        }`,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }

          // //make sure to serialize your JSON body
          // body: JSON.stringify({
          //   action: 'load',
          //   token: localStorage.getItem(this.token),
          //   id
          // })
        }
      );

      const json = await project.json();
      this.projects[id] = json;
      this.project = json;
    }
    return this.projects[id];
  }

  async deleteProject(id: string = 'default'): Promise<void> {
    delete this.projects[id];

    fetch(this.url + '/manage', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        action: 'delete',
        token: localStorage.getItem(this.token),
        id,
        group: this.projectGroup
      })
    });
  }

  saveProject(project: IProject): Promise<void> {
    this.projects[project.uid] = project;
    this.project = project;

    fetch(this.url + '/manage', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        action: 'save',
        token: localStorage.getItem(this.token),
        name: project.uid,
        group: this.projectGroup,
        project: JSON.stringify(project)
      })
    });
    return null;
  }
}
