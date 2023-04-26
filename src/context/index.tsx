import { JSX, createContext } from "preact";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { deleteNoteFromDB, getNotes, updateNoteInDB } from "../shared/db-utils";
import type { Note } from "../types";

type AppContextType = {
  db?: IDBDatabase;
  currentFolder: string;
  setCurrentFolder: (newFolder: string) => void;
  notes: Note[];
  setNotes: StateUpdater<Note[]>;
  handleDeleteNote: (id: string) => void;
  handleUpdateNote: (id: string, isFavorited?: boolean) => void;
};
const AppContext = createContext<AppContextType>({
  currentFolder: "",
  setCurrentFolder: () => "",
  notes: [],
  setNotes: () => "",
  handleDeleteNote: () => "",
  handleUpdateNote: () => "",
});

export const useAppContext = () => useContext(AppContext);

const createDB = (): Promise<IDBDatabase | null> => {
  if ("indexedDB" in window) {
    const request = window.indexedDB.open("notes-db", 1);

    const p = new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = (ev: Event) => {
        const db = (ev?.target as IDBOpenDBRequest)?.result;
        resolve(db);
      };
      request.onerror = (err) => {
        reject(err);
      };

      request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        const db = (ev?.target as IDBOpenDBRequest)?.result;
        db?.createObjectStore("notes");
        db?.createObjectStore("folders");
        const transaction = (ev?.target as IDBOpenDBRequest)?.transaction;
        if (transaction) {
          transaction.oncomplete = () => {
            resolve(db);
          };
        }
      };
    });
    return p;
  }

  return Promise.resolve(null);
};

export const AppContextProvider = ({
  children,
}: {
  children?: JSX.Element[];
}) => {
  const [db, setDB] = useState<IDBDatabase>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("Home");

  const createAndSetDB = async () => {
    const dbHandle = await createDB();
    if (dbHandle) {
      setDB(dbHandle);
    }
  };

  const getNotesFromDb = async () => {
    if (db) {
      const notesFromDB = await getNotes(db);
      setNotes(notesFromDB);
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

  if (!db) {
    createAndSetDB();
  }

  useEffect(() => {
    if (db) {
      getNotesFromDb();
    }
  }, [db]);

  return (
    <AppContext.Provider
      value={{
        db,
        currentFolder,
        notes,
        setNotes,
        setCurrentFolder,
        handleDeleteNote,
        handleUpdateNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
