import app from './app';
import chalk from 'chalk';
import configs from './app/configs';
import type { Server } from 'http';
let server: Server;

const bootStrap = async () => {
	try {
		await configs.connectDB();

		server = app.listen(configs.port, () => {
			console.info(
				chalk.yellowBright(
					`Server is Listening on Port: ${configs.port}`,
				),
			);
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(chalk.red(`Error Occurred: ${error.message}`));
		} else {
			console.error(chalk.red('Unknown Error Occurred!'));
		}
	}
};

bootStrap().catch(console.dir);

process.on('unhandledRejection', () => {
	console.error(
		chalk.redBright(
			`Unhandled Rejection Server Shutting Down`,
		),
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
		chalk.redBright(
			`Uncaught exception Server shutting down.`,
		),
	);

	process.exit(1);
});
