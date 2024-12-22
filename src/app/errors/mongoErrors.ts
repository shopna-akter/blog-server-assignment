import type { Error as MongoError } from 'mongoose';
import type {
	IDuplicateError,
	IErrorResponse,
	IErrorSource,
} from '../types/interfaces';

/**
 * Processes Mongoose Validation Errors and returns a structured response.
 */
export const handleValidationError = (
	error: MongoError.ValidationError,
	stack?: string,
): IErrorResponse => {
	const errorSource: IErrorSource[] = Object.values(error.errors).map(
		(err: MongoError.ValidatorError | MongoError.CastError) => ({
			path: err.path,
			message: err.message,
		}),
	);

	return {
		statusCode: 400,
		name: 'Validation Error',
		errorSource,
		stack,
	};
};

/**
 * Processes Mongoose Cast Errors and returns a structured response.
 */
export const handleCastError = (
	error: MongoError.CastError,
	stack?: string,
): IErrorResponse => {
	return {
		statusCode: 400,
		name: `Invalid ObjectId!`,
		errorSource: [
			{
				path: error.path,
				message: `Invalid ObjectId “${error.value}”!`,
			},
		],
		stack,
	};
};

export const handleDuplicateError = (
	error: IDuplicateError,
	stack?: string,
) => {
	const key = Object.keys(error.keyValue)[0];
	return {
		statusCode: 409,
		name: 'MongoDB Duplicate Error',
		errorSource: [
			{
				path: key,
				message: `Document exists with ${key}: ${error.keyValue[key]}`,
			},
		],
		stack,
	};
};

export const mongoErrors = {
	handleValidationError,
	handleCastError,
	handleDuplicateError,
};
