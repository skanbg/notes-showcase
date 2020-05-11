# Notes Backend application
The project is a showcase of technologies & coding practices

## Functionalities
The API can handle text and image notes
    - Text notes have a text body
    - Image notes have an image url
The REST API consists of
    - GET /notes - returns an array of all notes
    - POST /notes - creates a note that was passed 

## Approach

### Limited globals

#### Environment variables
process.env information is parsed and validated to a plain javascript object which is strongly typed with Typescript.
This object than can be used instead of the globals. This way we avoid pollution of global scope and changes by reference.

#### Pure functions
Global objects like Date, logging singleton and etc can stay wrapped. This helps with not having to stub globals and instead preparing mocks and fakes which dont require cleanup logic.

### Factory functions
help with a few problems

#### Inversion of Control
Using Factory functions you can initialize the dependencies and keep the boundaries clean.
The flow of the logic is unidirectional.

#### Isolate impure functions
Factory functions not only hide dependencies but also isolate dependencies with side effects.

The first invocation injects the dependencies with side effects and the second invocation is the one that handles the business logic.
The original "module" methods are also exported so they can be easily tested but are built using partial apply in mind.

Ignore the mutable "in-memory" implementation of storing notes. It can easily be replaced by a DB library.
```typescript
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
        add: add(storedNotes, environmentService),
    };
};
```

What you can see is that the `add` function can easily be unit tested because you need to provide a test double for the environment service.
The environment service has all of the impure(generating random guid and getting current timestamp) methods. We can also inject the logger the same way.

### Testing

#### TDD in mind
By having interfaces extracted you can focus on a single function and test only it.

Ideally the `add` function should be written like this:
```typescript
export const add = (
    saveNote: () => Promise<void>,
    getGuid: () => string,
    getCurrentTimestamp: () => number,
) => async (rawNote: newNoteType): Promise<noteType> => {
    const newNote: noteType = {
        id: getGuid(),
        ...rawNote,
        createdAt: getCurrentTimestamp(),
    };
    saveNote(newNote);

    return newNote;
};
```
This way you have a narrow focus into the data types and can write unit tests using TDD.
Implementation of getGuid, getCurrentTimestamp and saveNote can come second and will delay asking question like storage, date & time libraries and guid libraries.

#### Easy testing
Focus on immutable variables and explicit function returns using return and throwing errors. This avoids internal state that is hard to test.

### Clear boundaries
Infrastructure folder encapsulates all impure code. Usually this is the infrastructure like calling external services like DBs or 3rd party APIs. This is the code thats not suitable for unit testing or just not practical to do so.

Interfaces are extracted so implementation can change without breaking the api contract of the module.

### Contextual Logging
Logging is done using separate loggers based on context.
Types of logging context:
- API logging - logging each request
- Service logging - logging of different service calls
- Global logging - logging not bound to a server request. Logs actions like server bootstrap
