import { STATUS_CODES } from '../constants';
import processErrors from '../errors/processErrors';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import type { RequestHandler, ErrorRequestHandler } from 'express';

export const handleRouteNotFound: RequestHandler = (req, _res, next) => {
	const error = new ErrorWithStatus(
		'Not Found Error',
		`Requested End-Point “${req.method}: ${req.path}” Not Found!`,
		STATUS_CODES.NOT_FOUND,
		req.path,
	);

	return next(error);
};
export const catchAllErrors: ErrorRequestHandler = (err, _req, res, next) => {
	const { statusCode, name, errorSource, stack } = processErrors(err);
	console.error('Errors:');
	errorSource.forEach((err) => {
		console.error(`${err.message}`);
	});
	if (res.headersSent) {
		return next(err);
	}

	res.status(statusCode).json({
		success: false,
		message: errorSource.map((err) => err.message).join(' | '),
		statusCode,
		error: {
			details: errorSource.map((source) => ({ name, ...source })),
		},

		stack: stack ? stack : 'Stack Trace Not Available!',
	});
};
