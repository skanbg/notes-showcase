import {Router, Request, Response, RequestHandler} from 'express';
import * as HttpStatus from 'http-status-codes';

import {IEnvironmentService} from '../../interfaces/services/environment.interface';
import {INotesService} from '../../interfaces/services/notes.interface';
import { newNoteType, NoteTypeEnum } from '../../interfaces/models/note.model';

export const getNotesController = (notesService: INotesService): RequestHandler => async (request: Request, response: Response): Promise<void> => {
    const notes = await notesService.getAll();

    response.json(notes);
};

export const mapNewNote = (rawNote: any): newNoteType | undefined => {
    if (rawNote?.type === NoteTypeEnum.Image) {
        return {
            type: NoteTypeEnum.Image,
            imageUrl: rawNote.imageUrl,
        };
    }

    if (rawNote?.type === NoteTypeEnum.Text) {
        return {
            type: NoteTypeEnum.Text,
            text: rawNote.text,
        };
    }

    return undefined;
};

export const addNoteController = (notesService: INotesService): RequestHandler => async (request: Request, response: Response): Promise<void> => {
    const newNote = mapNewNote(request.body);

    // TODO: add validation
    if (newNote === undefined) {
        response.send({ error: 'Note cant be parsed' });
        return;
    }

    const note = await notesService.add(newNote);

    response.status(HttpStatus.CREATED).json(note);
};

export const initializeNotesRoutes = (notesService: INotesService, environmentService: IEnvironmentService): Router => {
    const router = Router();

    const allNotes = getNotesController(notesService);
    router.get('/notes', allNotes);

    const addNote = addNoteController(notesService);
    router.post('/notes', addNote);

    return router;
};

