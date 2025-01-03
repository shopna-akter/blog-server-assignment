import type { TokenPayload } from './app/types/interfaces';

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload;
		}
	}
}
