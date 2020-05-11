import { NextFunction, Response, Request } from 'express';
import { IGenericLogger } from '../../interfaces/infrastructure/generic-logger.infrastructure';

export const getRequestLoggableData = (request: Request) => ({
    originalUrl: request.originalUrl,
    httpMethod: request.method,
    requestProtocol: request.protocol,
    hostname: request.hostname,
});

export const initializeRequestsLoggingMiddleware = (apiRequestLogger: IGenericLogger) => {
    const middleware = (request: Request, response: Response, next: NextFunction): any => {
        const logData = getRequestLoggableData(request);

        const timer = apiRequestLogger.startTimer();
        timer.logger.info('Request received', logData);

        response.on('finish', () => {
            timer.done({ message: 'Request handled', meta: logData });
        });

        next();
    };

    return middleware;
};
