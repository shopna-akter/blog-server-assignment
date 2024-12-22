import { MongooseError } from 'mongoose';
import type { CastError } from 'mongoose';
import type {
	IDuplicateError,
	IParserError,
	INestedError,
} from '../types/interfaces';

export const isMongoDuplicateError = (
	error: unknown,
): error is IDuplicateError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as IDuplicateError).code === 11000
	);
};

export const isCastError = (error: unknown): error is CastError => {
	if (
		error &&
		typeof error === 'object' &&
		'name' in error &&
		error.name === 'CastError'
	) {
		return true;
	}
	if (
		error &&
		typeof error === 'object' &&
		'errors' in error &&
		error instanceof MongooseError
	) {
		const errors = (error as INestedError).errors;
		return Object.values(errors).some(
			(nestedError) =>
				typeof nestedError === 'object' &&
				nestedError !== null &&
				'name' in nestedError &&
				nestedError.name === 'CastError',
		);
	}

	return false;
};

export const isParserError = (error: unknown): error is IParserError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		error.type === 'entity.parse.failed'
	);
};

export const typeGuards = { isCastError, isMongoDuplicateError, isParserError };
