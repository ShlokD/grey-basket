import { useAppContext } from "../context";
import { useEffect, useState } from "preact/hooks";
import { AddButton } from "./add-button";
import { NotesList, NotesForm } from "./notes";
import { FolderForm, FolderList } from "./folder";
import { v4 } from "uuid";

import type { Note, Folder } from "./types";

const getNotes = (db: IDBDatabase) => {
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

const getFolders = (db: IDBDatabase) => {
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

const addNoteToDB = (db: IDBDatabase, note: Note) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.add(note, note.id);
};

const deleteNoteFromDB = (db: IDBDatabase, id: string) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.delete(id);
};

const addFolderToDb = (db: IDBDatabase, folder: Folder) => {
  const store = db.transaction("folders", "readwrite").objectStore("folders");
  store.add({ id: folder.id, name: folder.name }, folder.id);
};

const updateNoteInDB = (db: IDBDatabase, note: Note) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.put(note, note.id);
};

const AddNote = () => (
  <h2 className="font-bold text-yellow-300 text-3xl text-center">
    Create your first note
  </h2>
);

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showFoldersForm, setShowFoldersForm] = useState(false);
  const { currentFolder, setCurrentFolder } = useAppContext();

  const { db } = useAppContext();

  const getNotesFromDb = async () => {
    if (db) {
      const notesFromDB = await getNotes(db);
      setNotes(notesFromDB);
    }
  };

  const getFoldersFromDb = async () => {
    if (db) {
      const foldersFromDb = await getFolders(db);
      setFolders(foldersFromDb);
    }
  };

  const handleFolderClick = async (name: string) => {
    setCurrentFolder(name);
  };

  const onAddNote = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const note = {
      id: v4(),
      folder: currentFolder,
      title,
      description,
    };
    setNotes((prev) => [...prev, note]);
    setShowNotesForm(false);
    if (db) {
      addNoteToDB(db, note);
    }
  };

  const onAddFolder = (name: string) => {
    const folder = { id: v4(), name };
    setFolders((prev) => [...prev, folder]);
    setShowFoldersForm(false);
    if (db) {
      addFolderToDb(db, folder);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (db) {
      deleteNoteFromDB(db, id);
    }
  };

  const handleUpdateNote = (id: string, isFavorited?: boolean) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const noteIndex = notes.findIndex((note) => note.id === id);
      const newNote = {
        ...note,
        favorite: isFavorited,
      };
      const newNotes = notes.slice();
      newNotes[noteIndex] = newNote;
      setNotes(newNotes);
      if (db) {
        updateNoteInDB(db, newNote);
      }
    }
  };

  useEffect(() => {
    if (db) {
      getNotesFromDb();
    }
  }, [db]);

  useEffect(() => {
    if (db) {
      getFoldersFromDb();
    }
  }, [db]);

  const filteredNotes = notes.filter((note) => note.folder === currentFolder);

  return (
    <>
      {
        <div className={`${showNotesForm ? "inline-block" : "hidden"}`}>
          <NotesForm
            onClose={onAddNote}
            onCancel={() => setShowNotesForm(false)}
          />
        </div>
      }

      {
        <div className={`${showFoldersForm ? "inline-block" : "hidden"}`}>
          <FolderForm
            onClose={onAddFolder}
            onCancel={() => setShowFoldersForm(false)}
          />
        </div>
      }
      <div
        className={`${
          showNotesForm || showFoldersForm ? "hidden" : "inline-block"
        } w-full`}
      >
        <FolderList
          folders={folders}
          handleFolderClick={handleFolderClick}
          showFoldersForm={showFoldersForm}
          currentFolder={currentFolder}
        />
      </div>
      <div
        className={`flex flex-col items-center justify-center h-full w-full my-2 ${
          showNotesForm || showFoldersForm ? "hidden" : ""
        }`}
      >
        {filteredNotes.length === 0 ? (
          <AddNote />
        ) : (
          <NotesList
            notes={filteredNotes}
            onDeleteNote={handleDeleteNote}
            onUpdateNote={handleUpdateNote}
          />
        )}
        <AddButton
          handleAddNote={() => setShowNotesForm(true)}
          handleAddFolder={() => setShowFoldersForm(true)}
        />
      </div>
    </>
  );
};
