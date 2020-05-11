export interface IEnvironmentService {
    isProduction: () => boolean;
    getCurrentTimestamp: () => number;
    getGuid: () => string;
}
