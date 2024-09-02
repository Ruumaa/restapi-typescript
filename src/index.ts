import express, { Application } from 'express';
import { routes } from './routes';
import { logger } from './utils/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
// connect DB
import './utils/db';

import deserializedToken from './middleware/deserializedToken';

const app: Application = express();
const port = 4000;

// parse body request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors access handler
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Controll-Allow-Methods', '*');
  res.setHeader('Access-Controll-Allow-Headers', '*');
  next();
});

app.use(deserializedToken);

routes(app);

app.listen(port, () => logger.info(`Server is running on port ${port}`));
