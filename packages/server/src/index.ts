import express from 'express';
import fs from 'fs';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';

import { registerRoutes, config } from '@toryjs/express-api';

const app = express();
const port = config.port;
const root = path.resolve(config.dir);

console.log(`📂  Serving config files from "${root}"`);

// allow cross origin
app.use(function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(root));

registerRoutes(app);

app.listen(port, () => console.log(`🚀  Tory server listening on port ${port}!`));
