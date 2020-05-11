import { noteType, newNoteType } from "../models/note.model";

export interface INotesService {
  getAll: () => Promise<noteType[]>;
  add: (note: newNoteType) => Promise<noteType>;
}
