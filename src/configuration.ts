import {IServerConfiguration, IProcessEnv} from './interfaces/configuration.interface';

export const getConfiguration = (environment: IProcessEnv): IServerConfiguration => {
    if (environment.NODE_ENV === undefined) {
        throw new Error('NODE_ENV environment variable is required');
    }

    if (environment.SERVER_PORT === undefined) {
        throw new Error('SERVER_PORT environment variable is required');
    }

    if (environment.SERVER_HOST === undefined) {
        throw new Error('SERVER_HOST environment variable is required');
    }

    return {
        NODE_ENV: environment.NODE_ENV,
        SERVER_HOST: environment.SERVER_HOST,
        SERVER_PORT: parseInt(environment.SERVER_PORT, 10),
    };
}
