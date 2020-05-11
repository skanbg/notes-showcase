import winston from 'winston';
import stream from 'stream';

export const getVoidLogger = () => {
    const writeableStream = new stream.Writable({
        objectMode: true,
        // tslint:disable-next-line: no-empty
        write: () => {},
    });
    const voidLogsTransport = new winston.transports.Stream({ stream: writeableStream });
    const logger = winston.createLogger({
        transports: [voidLogsTransport]
    });

    return logger;
}
