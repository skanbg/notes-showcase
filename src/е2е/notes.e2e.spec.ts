import request from 'supertest';
import * as HttpStatus from 'http-status-codes';

import {startServer} from '../server';
import { initializeEnvironmentService } from '../services/environment.service';
import { INewTextNote, NoteTypeEnum, INewImageNote } from '../interfaces/models/note.model';

import { getVoidLogger } from '../infrastructure/logger.infrastructure.mock';

const getServer = async () => {
    const serverConfiguration = { NODE_ENV: 'test', SERVER_HOST: '127.0.0.1', SERVER_PORT: 3000 };
    const initializeGlobalLogger = () => getVoidLogger();
    const initializeApiRequestLogger = () => getVoidLogger();
    const server = await startServer(serverConfiguration, initializeGlobalLogger, initializeApiRequestLogger, initializeEnvironmentService);

    return server;
};

describe('[Notes] endpoint', () => {
    it('[GET /] should return empty response with HTTP 200', async () => {
        const server = await getServer();

        const response = await request(server)
            .get('/notes')
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual([]);
    });

    it('[POST /] should return text note with all required properties and HTTP 201', async () => {
        const server = await getServer();

        const textNote: INewTextNote = { type: NoteTypeEnum.Text, text: 'magic text' };
        const response = await request(server)
            .post('/notes')
            .send(textNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual(expect.objectContaining({
            type: NoteTypeEnum.Text,
            text: 'magic text',
            id: expect.any(String),
            createdAt: expect.any(Number),
        }));
    });

    it('[POST /] should return image note with all required properties and HTTP 201', async () => {
        const server = await getServer();

        const imageNote: INewImageNote = { type: NoteTypeEnum.Image, imageUrl: 'http://localhost' };
        const response = await request(server)
            .post('/notes')
            .send(imageNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual(expect.objectContaining({
            type: NoteTypeEnum.Image,
            imageUrl: 'http://localhost',
            id: expect.any(String),
            createdAt: expect.any(Number),
        }));
    });

    it('[POST /] should store text note and return it in get request', async () => {
        const server = await getServer();

        const textNote: INewTextNote = { type: NoteTypeEnum.Text, text: 'magic text' };
        await request(server)
            .post('/notes')
            .send(textNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);

        const response = await request(server)
            .get('/notes')
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/);

        expect(response.body.length).toStrictEqual(1);
        expect(response.body).toStrictEqual(expect.arrayContaining([expect.objectContaining({ type: NoteTypeEnum.Text, text: 'magic text' })]));
    });

    it('[POST /] should store image note and return it in get request', async () => {
        const server = await getServer();

        const imageNote: INewImageNote = { type: NoteTypeEnum.Image, imageUrl: 'http://localhost' };
        await request(server)
            .post('/notes')
            .send(imageNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);
        
        const response = await request(server)
            .get('/notes')
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/);

        expect(response.body.length).toStrictEqual(1);
        expect(response.body).toStrictEqual(expect.arrayContaining([expect.objectContaining({
            type: NoteTypeEnum.Image,
            imageUrl: 'http://localhost',
            id: expect.any(String),
            createdAt: expect.any(Number),
        })]));
    });

    it('[POST /] should store multiple image and text notes and return them in get request', async () => {
        const server = await getServer();
        
        const imageNote: INewImageNote = { type: NoteTypeEnum.Image, imageUrl: 'http://localhost' };
        await request(server)
            .post('/notes')
            .send(imageNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);

        const textNote: INewTextNote = { type: NoteTypeEnum.Text, text: 'magic text' };
        await request(server)
            .post('/notes')
            .send(textNote)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);
        
        const response = await request(server)
            .get('/notes')
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/);

        expect(response.body.length).toStrictEqual(2);
        expect(response.body).toStrictEqual(expect.arrayContaining([
            expect.objectContaining({
                type: NoteTypeEnum.Text,
                text: 'magic text',
                id: expect.any(String),
                createdAt: expect.any(Number),
            }),
            expect.objectContaining({
                type: NoteTypeEnum.Image,
                imageUrl: 'http://localhost',
                id: expect.any(String),
                createdAt: expect.any(Number),
            }),
        ]));
    });

});
