export enum NoteTypeEnum {
    Text = 'Text',
    Image = 'Image',
};

export interface ITextNote {
    id: string;
    type: NoteTypeEnum.Text;
    text: string;
    createdAt: number;
}

export interface IImageNote {
    id: string;
    type: NoteTypeEnum.Image;
    imageUrl: string;
    createdAt: number;
}

export type noteType = ITextNote | IImageNote;

export interface INewTextNote {
    type: NoteTypeEnum.Text;
    text: string;
}

export interface INewImageNote {
    type: NoteTypeEnum.Image;
    imageUrl: string;
}

export type newNoteType = INewTextNote | INewImageNote;
