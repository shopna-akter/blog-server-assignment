import configs from '../../configs';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { authServices } from './auth.services';

const registerUser = catchAsync(async (req, res) => {
	const result = await authServices.registerUserInDB(req.body);

	sendResponse(res, 'User', 'POST', result, 'User registered successfully!');
});

const loginUser = catchAsync(async (req, res) => {
	const tokens = await authServices.loginUser(req.body);

	const { refreshToken, accessToken } = tokens;

	res.cookie('refreshToken', refreshToken, {
		secure: configs.NODE_ENV === 'production',
		httpOnly: true,
	});

	sendResponse(
		res,
		'User',
		'OK',
		{ token: accessToken },
		'Login successful!',
	);
});


export const authControllers = { registerUser, loginUser };
