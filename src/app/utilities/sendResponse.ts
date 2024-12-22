import type { Response } from 'express';
import type { TCollection, TMethod, TResponseDetails } from '../types';


const sendResponse = <T>(
	res: Response,
	collection: TCollection,
	method: TMethod,
	data?: T,
	customMessage?: string,
): void => {
	const { message, statusCode } = generateResponse(collection, method, data);

	const response = {
		success: true,
		message: customMessage ? customMessage : message,
		statusCode,
		...(data && { data }),
	};

	res.status(statusCode).json(response);
};


const generateResponse = <T>(
	collection: TCollection,
	method: TMethod,
	data?: T,
): TResponseDetails => {
	const isArray = Array.isArray(data);

	let message = 'Operation Successful!',
		statusCode = 200;

	switch (method) {
		case 'OK':
			statusCode = 200;
			break;
		case 'POST':
			statusCode = 201;
			message = `${collection} created successfully!`;
			break;
		case 'GET':
			message = isArray
				? `${collection}s fetched successfully!`
				: `${collection} fetched successfully!`;
			break;
		case 'PUT':
		case 'PATCH':
			message = `${collection} updated successfully!`;
			break;
		case 'DELETE':
			message = `${collection} deleted successfully!`;
			break;
		default:
			break;
	}

	return { message, statusCode };
};

export default sendResponse;
