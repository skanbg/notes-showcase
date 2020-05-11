import { LeveledLogMethod, LogEntry, Logger, Profiler } from 'winston';

export interface IGenericLogger extends Logger {
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    verbose: LeveledLogMethod;
    debug: LeveledLogMethod;
    silly: LeveledLogMethod;
    profile(id: string | number, meta?: LogEntry): Logger;
    startTimer(): Profiler;
}
