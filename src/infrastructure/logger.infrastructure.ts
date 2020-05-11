import winston, { Container, format } from 'winston';

import { LoggingContext } from '../constants/infrastructure/logging-context.infrastructure.constant';

export const getLoggerContainer = (): Container => {
    const logsContainer = new winston.Container();

    // ApiRequests logger - Logs each API request
    logsContainer.add(
        LoggingContext.ApiRequests,
        {
            format: format.combine(
                format.metadata(),
                format.label({ label: LoggingContext.ApiRequests }),
                format.timestamp(),
                format.json(),
            ),
            transports: [
                new winston.transports.Console(),
            ],
        },
    );

    // Global logger - logging not bound to a server request. Logs actions like server bootstrap
    logsContainer.add(
        LoggingContext.Global,
        {
            format: format.combine(
                format.metadata(),
                format.label({ label: LoggingContext.Global }),
                format.timestamp(),
                format.json(),
            ),
            transports: [
                new winston.transports.Console(),
            ],
        },
    );

    // Service logger
    logsContainer.add(
        LoggingContext.Service,
        {
            format: format.combine(
                format.metadata(),
                format.label({ label: LoggingContext.Service }),
                format.timestamp(),
                format.json(),
            ),
            transports: [
                new winston.transports.Console(),
            ],
        },
    );

    return logsContainer;
};
