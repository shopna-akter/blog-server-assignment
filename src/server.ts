import app from './app';
import configs from './app/configs';

const bootStrap = async () => {
	try {
		await configs.connectDB();

		app.listen(configs.port, () => {
			console.info(
					`Server is Listening on Port: ${configs.port}`,
			);
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error Occurred: ${error.message}`);
		} else {
			console.error('Unknown Error Occurred!');
		}
	}
};

bootStrap().catch(console.dir);


