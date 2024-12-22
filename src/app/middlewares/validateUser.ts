import configs from '../configs';
import catchAsync from '../utilities/catchAsync';
import type { TUserRole } from '../modules/user/user.types';
import { ErrorWithStatus } from '../classes/withStatusError';
import { User } from '../modules/user/user.model';
import { verifyToken } from '../utilities/authUtilities';
import { STATUS_CODES } from '../constants';


const auth = (...requiredRoles: TUserRole[]) => {
	return catchAsync(async (req, _res, next) => {
		const token = req.headers.authorization?.split(' ')[1];

		const decoded = verifyToken(configs.accessSecret, token);

		const user = await User.validateUser(decoded.email);

		if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
			throw new ErrorWithStatus(
				'Authorization Error',
				"You're not authorized!",
				STATUS_CODES.UNAUTHORIZED,
				'auth',
			);
		}

		req.user = decoded;

		next();
	});
};

export default auth;
