import express, { NextFunction, Request, Response } from 'express';

const app = express();
const port = 4000;

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello min' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
