import * as express from 'express';
import * as mongoose from "mongoose";
import { join } from 'path';
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import "./lib/env";
import bodyParser = require('body-parser');

mongoose.connect(process.env.MONGOURI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
  
  const app = createExpressServer({
    controllers: [__dirname + "/controllers/**/*.js"]
  });
  
  app.set('view engine', 'pug');
  app.use('/assets', express.static(join(__dirname, '..', 'assets')))

  // Global Template Vars
  app.locals.name = process.env.NAME
  app.locals.basedir = join(__dirname, '..');

  app.listen(process.env.PORT, () => console.log(`Listening on Port: ${process.env.PORT}`));