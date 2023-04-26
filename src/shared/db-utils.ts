import type { Folder, Note } from "../types";

export const getNotes = (db: IDBDatabase) => {
  const store = db.transaction("notes").objectStore("notes");
  const notes: Note[] = [];
  const p = new Promise<Note[]>((resolve) => {
    store.openCursor().onsuccess = (event: Event) => {
      const cursor: IDBCursorWithValue = (event?.target as IDBRequest)?.result;
      if (cursor) {
        notes.push(cursor.value);
        cursor.continue();
      }
      else {
        resolve(notes);
      }
    };
  });
  return p;
};

export const getFolders = (db: IDBDatabase) => {
  const store = db.transaction("folders").objectStore("folders");
  const folders: Folder[] = [{ id: "home", name: "Home" }];
  const p = new Promise<Folder[]>((resolve) => {
    store.openCursor().onsuccess = (event: Event) => {
      const cursor: IDBCursorWithValue = (event?.target as IDBRequest)?.result;
      if (cursor) {
        folders.push(cursor.value);
        cursor.continue();
      }
      else {
        resolve(folders);
      }
    };
  });
  return p;
};

export const addNoteToDB = (db: IDBDatabase, note: Note) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.add(note, note.id);
};

export const deleteNoteFromDB = (db: IDBDatabase, id: string) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.delete(id);
};

export const addFolderToDb = (db: IDBDatabase, folder: Folder) => {
  const store = db.transaction("folders", "readwrite").objectStore("folders");
  store.add({ id: folder.id, name: folder.name }, folder.id);
};

export const updateNoteInDB = (db: IDBDatabase, note: Note) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.put(note, note.id);
};
