import { ZodError } from 'zod';
import { typeGuards } from './errorGuard';
import { handleZodErrors } from './zodError';
import { Error as MongoError } from 'mongoose';
import { mongoErrors } from './dbError';
import { genericErrors } from './genericError';
import type { IErrorResponse } from '../types/interfaces';
import { ErrorWithStatus } from '../classes/withStatusError';


const processErrors = (error: unknown): IErrorResponse => {
	const stack = error instanceof Error ? error.stack : 'Stack Not Available!';

	if (error instanceof ZodError) {
		return handleZodErrors(error, stack);
	}
	else if (typeGuards.isMongoDuplicateError(error)) {
		return mongoErrors.handleDuplicateError(error, stack);
	}
	else if (error instanceof MongoError.ValidationError) {
		return mongoErrors.handleValidationError(error, stack);
	}
	else if (typeGuards.isCastError(error)) {
		return mongoErrors.handleCastError(error, stack);
	}
	else if (typeGuards.isParserError(error)) {
		return genericErrors.handleParserError(error, stack);
	}
	else if (error instanceof ErrorWithStatus) {
		return genericErrors.handleErrorWithStatus(error, stack);
	}
	else if (error instanceof Error) {
		return genericErrors.handleGenericError(error, stack);
	}
	return {
		statusCode: 500,
		name: 'Unknown Error!',
		errorSource: [
			{ path: 'unknown', message: 'An Unknown Error Occurred!' },
		],
		stack,
	};
};

export default processErrors;
