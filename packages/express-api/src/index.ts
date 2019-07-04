import fs from 'fs';
import path from 'path';

import LzString from 'lz-string';

import { Request, Response, Express } from 'express';

const defaultIndex = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tory App</title>
    <script>tory_website = $website;</script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

export enum Compression {
  UTF16 = 'UTF16',
  Base64 = 'Base64',
  Off = 'Off'
}

export type Config = {
  port: number;
  dir: string;
  history: number;
  api: string;
  compression: Compression;
  index: string;
  useIndex: boolean;
  flat: boolean;
};

export let config: Config = {
  port: 4100,
  dir: 'app',
  history: 10,
  api: '/api',
  compression: Compression.Base64,
  index: '',
  useIndex: false,
  flat: true
};

try {
  if (fs.existsSync('.tory')) {
    console.log('Found custom config');
    config = { ...config, ...JSON.parse(fs.readFileSync('.tory', { encoding: 'utf-8' })) };

    console.log(config);
  } else {
    console.log('Starting with default config');
  }
} catch (ex) {
  console.error('Problem parsing your config file: ' + ex.message);
}

const defaultProject = {
  id: 'default',
  uid: 'default',
  form: { control: 'Form', uid: 'P-0', elements: [] },
  schema: { type: 'object', properties: {} },
  version: 0
};

let websites: {
  [index: string]: {
    [index: string]: {
      content: any;
      index?: string;
    };
  };
} = {};
let root: string | undefined;

function resolve(projectName: string, group: string) {
  if (!root) {
    root = config.dir;
    if (!root) {
      console.log('Root has not beet set. Setting to "./definition"');
      root = './definition';
    }
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  const projectDir = path.join(root, group, config.flat ? '' : projectName);
  const projectFile = path.join(projectDir, config.flat ? `${projectName}.json` : 'website.json');
  const indexFile = path.join(projectDir, config.flat ? `${projectName}.html` : 'index.html');

  // make sure all directories exist
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  }

  return { projectDir, projectFile, indexFile };
}

function packWebsite(definition: string) {
  return config.compression === Compression.UTF16
    ? `"${LzString.compressToUTF16(definition)}"`
    : config.compression === Compression.Base64
    ? `"${LzString.compressToBase64(definition)}"`
    : definition;
}

function loadWebsite(req: Request, projectName: string, group: string) {
  if (!websites[group]) {
    websites[group] = {};
  }

  // const projectName = req.query.id || 'default';
  if (!websites[group][projectName]) {
    const { projectFile, indexFile } = resolve(projectName, group);

    if (fs.existsSync(projectFile)) {
      let content = fs.readFileSync(projectFile, { encoding: 'utf-8' });

      websites[group][projectName] = {
        content: JSON.parse(content),
        index: config.useIndex
          ? fs
              .readFileSync(indexFile, { encoding: 'utf-8' })
              .replace('$website', packWebsite(content))
          : undefined
      };
    } else {
      const projectContent = { ...defaultProject, id: projectName, uid: projectName };
      let index = config.index || defaultIndex;
      fs.writeFileSync(projectFile, JSON.stringify(projectContent), { encoding: 'utf-8' });

      if (config.useIndex) {
        fs.writeFileSync(indexFile, index, { encoding: 'utf-8' });
      }
      websites[group][projectName] = {
        content: projectContent,
        index: config.useIndex ? index.replace('$website', packWebsite('{}')) : undefined
      };
    }
  }
  return websites[group][projectName];
}

export function loadProject(req: Request, res: Response) {
  res.json(loadWebsite(req, req.query.id, req.query.group || '').content);
}

export function serveIndex(req: Request, res: Response) {
  res.write(loadWebsite(req, req.query.id, req.query.group || '').index);
  res.end();
}

export function registerRoutes(app: Express) {
  app.post(config.api + '/manage', manageProjects);
  app.get(config.api + '/load', loadProject);

  if (config.useIndex) {
    app.get('/*', serveIndex);
  }
}

export function manageProjects(req: Request, res: Response) {
  const projectName = req.body.name || 'default';
  const { projectDir, projectFile, indexFile } = resolve(projectName, req.body.group || '');

  const backup = path.join(projectDir, 'backup');
  if (!fs.existsSync(backup)) {
    fs.mkdirSync(backup);
  }

  // SAVE FILE
  const base = path.basename(projectFile, '.json');
  const backupFile = path.join(
    backup,
    `${base}.${new Date().toISOString().replace(/:/g, '-')}.json`
  );

  if (req.body.action === 'save') {
    const current = loadWebsite(req, projectName, req.body.group || '');

    const content = req.body.project;
    current.content = JSON.parse(content);
    current.content.version = current.content.version == null ? 0 : current.content.version + 1;

    // handle index file
    if (config.useIndex) {
      current.index = fs
        .readFileSync(indexFile, { encoding: 'utf-8' })
        .replace('$website', packWebsite(JSON.stringify(current.content)));
    }

    // create backup and remove all files that are not wanted (maximum history is reached)
    if (config.history != 0 && fs.existsSync(projectFile)) {
      fs.renameSync(projectFile, backupFile);

      // remove backup files
      var files = fs.readdirSync(backup).filter(name => name.indexOf(base) >= 0);
      if (config.history != -1 && files.length > config.history) {
        let oldest = path.join(backup, files[0]);
        let oldestStat = fs.statSync(oldest).mtime.getTime();
        files.forEach(function(a) {
          if (oldestStat > fs.statSync(path.join(backup, a)).mtime.getTime()) {
            oldest = path.join(backup, a);
            oldestStat = fs.statSync(oldest).mtime.getTime();
          }
        });
        console.log('Removing backup: ' + oldest);
        fs.unlinkSync(oldest);
      }
    }
    fs.writeFileSync(projectFile, content, { encoding: 'utf-8' });
    res.json({});
    return;
  }
}
