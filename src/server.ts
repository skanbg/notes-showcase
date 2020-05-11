import { Server } from 'http';
import express, { Response, Router } from 'express';
import bodyParser from 'body-parser';

import { IServerConfiguration } from './interfaces/configuration.interface';
import { IGenericLogger } from './interfaces/infrastructure/generic-logger.infrastructure';
import { IEnvironmentService } from './interfaces/services/environment.interface';

import { initializeNotesRoutes } from './express/controllers/notes.controller';
import { initializeRequestsLoggingMiddleware } from './express/middlewares/requests-logger.middleware';
import { initializeNotesService } from './services/notes.service';

export const startServer = async (
    configuration: IServerConfiguration,
    initializeGlobalLogger: () => IGenericLogger,
    initializeApiRequestLogger: () => IGenericLogger,
    initializeEnvironmentService: (configuration: IServerConfiguration) => IEnvironmentService,
): Promise<Server> => {
    const globalLogger = initializeGlobalLogger();
    const apiRequestLogger = initializeApiRequestLogger();

    globalLogger.profile('Server bootstrap');

    // Services (a.k.a utils, managers, helpers)
    const environmentService: IEnvironmentService = initializeEnvironmentService(configuration);
    const notesService = initializeNotesService(environmentService);

    // Routes
    const notesRoutes: Router = initializeNotesRoutes(notesService, environmentService);

    // Middleware
    const requestsLoggingMiddleware = initializeRequestsLoggingMiddleware(apiRequestLogger);

    const application = express()
        .use(requestsLoggingMiddleware)
        .use(bodyParser.json())
        .use(notesRoutes)
        .get('/', (_, response: Response) => {
            response.send('Hello world!');
        });

    globalLogger.profile('Server bootstrap');

    const server = new Server(application);
    return server;
};
