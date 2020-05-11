export interface IProcessEnv {
    [key: string]: string | undefined;
}

export interface IServerConfiguration {
    NODE_ENV: 'production' | string; // If needed can be typed more strictly like: 'production' | 'staging' | 'development';
    SERVER_HOST: string;
    SERVER_PORT: number;
}
