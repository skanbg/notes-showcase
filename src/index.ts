import { Server } from 'http';

import { startServer } from './server';
import {getConfiguration} from './configuration';
import {IServerConfiguration} from './interfaces/configuration.interface';
import { getLoggerContainer } from './infrastructure/logger.infrastructure';
import { LoggingContext } from './constants/infrastructure/logging-context.infrastructure.constant';
import { initializeEnvironmentService } from './services/environment.service';

const configuration: IServerConfiguration = getConfiguration(process.env);

const loggerContainer = getLoggerContainer();
const initializeGlobalLogger = () => loggerContainer.get(LoggingContext.Global);
const initializeApiRequestLogger = () => loggerContainer.get(LoggingContext.ApiRequests);

startServer(configuration, initializeGlobalLogger, initializeApiRequestLogger, initializeEnvironmentService)
    .then((application: Server) => {
        const { SERVER_HOST, SERVER_PORT } = configuration;
        const globalLogger = initializeGlobalLogger();

        application.listen(SERVER_PORT, SERVER_HOST, () => globalLogger.info(`Listening on host ${SERVER_HOST} and port ${SERVER_PORT}`));
    })
    .catch((error: Error) => {
        console.error('Server failed on startup', error);
    });
