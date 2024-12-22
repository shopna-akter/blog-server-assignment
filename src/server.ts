import app from './app';
import configs from './app/configs';
import type { Server } from 'http';
let server: Server;

const bootStrap = async () => {
	try {
		await configs.connectDB();

		server = app.listen(configs.port, () => {
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

process.on('unhandledRejections', () => {
	console.error(
			`Unhandleds Rejection Server Shutting Down`,
	);

	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

process.on('uncaughtException', () => {
	console.error(
			`Uncaught exception Server shutting down.`,
	);

});
