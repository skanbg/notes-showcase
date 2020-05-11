import {IEnvironmentService} from '../interfaces/services/environment.interface';
import { noteType, newNoteType } from '../interfaces/models/note.model';
import { INotesService } from '../interfaces/services/notes.interface';

export const getAll = (storedNotes: noteType[]) => async (): Promise<noteType[]> => [...storedNotes];

export const add = (storedNotes: noteType[], environmentService: IEnvironmentService) => async (rawNote: newNoteType): Promise<noteType> => {
    const newNote: noteType = {
        id: environmentService.getGuid(),
        ...rawNote,
        createdAt: environmentService.getCurrentTimestamp(),
    };
    storedNotes.push(newNote);

    return newNote;
};

export const initializeNotesService = (environmentService: IEnvironmentService): INotesService => {
    const storedNotes: noteType[] = [];

    return {
        getAll: getAll(storedNotes),
        add: add(storedNotes, environmentService),
    };
};
