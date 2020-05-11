import {IServerConfiguration} from '../interfaces/configuration.interface';
import {IEnvironmentService} from '../interfaces/services/environment.interface';

export const isProduction = (configuration: IServerConfiguration) => (): boolean => configuration.NODE_ENV === 'production';

export const getCurrentTimestamp = () => () => (new Date()).getTime();

// TODO: replace with real GUID
export const getGuid = () => () => (new Date()).getTime().toString();

export const initializeEnvironmentService = (configuration: IServerConfiguration): IEnvironmentService => {
    return {
        isProduction: isProduction(configuration),
        getCurrentTimestamp: getCurrentTimestamp(),
        getGuid: getGuid(),
    };
};
