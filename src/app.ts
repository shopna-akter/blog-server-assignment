import cors from 'cors';
import express from 'express';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import sendResponse from './app/utilities/sendResponse';
import type { Application, Request, Response } from 'express';
import {
	catchAllErrors,
	handleRouteNotFound,
} from './app/middlewares/errorHandlers';
const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
	sendResponse(res, 'N/A', 'OK', null, 'Server is Running');
});

app.use('/api', router);
app.use(handleRouteNotFound);
app.use(catchAllErrors);

export default app;
