import { useAppContext } from "../context";
import { useEffect, useState } from "preact/hooks";

type Note = {
  id: number;
  title: string;
  description: string;
  folder: string;
};

type Folder = {
  id: number;
  name: string;
};

const getNotes = (db: IDBDatabase, folder = "") => {
  const store = db.transaction("notes").objectStore("notes");
  const notes: Note[] = [];
  const p = new Promise<Note[]>((resolve) => {
    store.openCursor().onsuccess = (event: Event) => {
      const cursor: IDBCursorWithValue = (event?.target as IDBRequest)?.result;
      if (cursor && cursor.value.folder === folder) {
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
  const folders: Folder[] = [];
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

const addFolderToDb = (db: IDBDatabase, folder: Folder) => {
  const store = db.transaction("folders", "readwrite").objectStore("folders");
  store.add({ name: folder.name }, folder.id);
};

const AddNote = () => (
  <h2 className="font-bold text-yellow-300 text-3xl text-center">
    Create your first note
  </h2>
);

const NotesList = ({ notes }: { notes: Note[] }) => (
  <div className="flex flex-col items-center justify-start w-full h-full">
    {notes.map((note, idx) => (
      <div
        className="bg-yellow-300 p-2 my-2 w-10/12 rounded-lg text-black"
        key={`note-${idx}`}
      >
        <p className="text-lg font-bold">{note.title}</p>
        <p className="my-2">{note.description}</p>
      </div>
    ))}
  </div>
);

const NotesForm = ({
  onClose,
}: {
  onClose: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    if (!title && !description) {
      return;
    }
    onClose({ title, description });
    setTitle("");
    setDescription("");
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full my-4">
      <input
        className="bg-green-200 p-4 rounded-lg w-11/12 m-4 placeholder-gray text-black"
        value={title}
        onChange={(ev) => setTitle((ev?.target as HTMLInputElement)?.value)}
        placeholder="Title"
        aria-label="Enter note title"
      />
      <textarea
        className="bg-green-200 p-4 rounded-lg w-11/12 h-11/12 text-black"
        value={description}
        onChange={(ev) =>
          setDescription((ev?.target as HTMLTextAreaElement)?.value)
        }
        placeholder="Text"
        rows={13}
        aria-label="Enter note text"
      />
      <button
        className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4"
        onClick={handleClose}
      >
        Save
      </button>
    </div>
  );
};

const FolderForm = ({ onClose }: { onClose: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleClose = () => {
    if (!name) {
      return;
    }
    onClose(name);
    setName("");
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full my-4">
      <input
        className="bg-green-200 p-4 rounded-lg w-11/12 m-4 placeholder-gray text-black"
        value={name}
        onChange={(ev) => setName((ev?.target as HTMLInputElement)?.value)}
        placeholder="Name"
        aria-label="Enter folder name"
      />
      <button
        className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4"
        onClick={handleClose}
      >
        Save
      </button>
    </div>
  );
};

export const AddButton = ({
  handleAddNote,
  handleAddFolder,
}: {
  handleAddNote: () => void;
  handleAddFolder: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  return expanded ? (
    <div className="flex flex-col fixed bottom-32 z-auto right-4">
      <button
        className="border border-black bg-blue-300 p-4 text-black"
        onClick={handleAddNote}
      >
        Note
      </button>
      <button
        className="border border-black bg-blue-300 p-4 text-black"
        onClick={handleAddFolder}
      >
        Folder
      </button>
    </div>
  ) : (
    <button
      aria-label="Add a Note"
      className="px-6 py-4 bg-blue-300 my-4 text-5xl rounded-full fixed bottom-32 z-auto right-4"
      onClick={() => setExpanded((prev) => !prev)}
    >
      +
    </button>
  );
};
export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showFoldersForm, setShowFoldersForm] = useState(false);

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

  const onAddNote = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const note = { id: notes.length + 1, folder: "", title, description };
    setNotes((prev) => [...prev, note]);
    if (db) {
      addNoteToDB(db, note);
    }
  };

  const onAddFolder = (name: string) => {
    const folder = { id: folders.length + 1, name };
    setFolders((prev) => [...prev, folder]);
    setShowFoldersForm(false);
    if (db) {
      addFolderToDb(db, folder);
    }
  };

  useEffect(() => {
    if (db) {
      getNotesFromDb();
      getFoldersFromDb();
    }
  }, [db]);

  return (
    <>
      {
        <div className={`${showNotesForm ? "inline-block" : "hidden"}`}>
          <NotesForm onClose={onAddNote} />
        </div>
      }

      {
        <div className={`${showFoldersForm ? "inline-block" : "hidden"}`}>
          <FolderForm onClose={onAddFolder} />
        </div>
      }

      {folders.length > 0 && (
        <>
          <div
            className={`flex items-center w-full h-1/12 overflow-x-scroll ${
              showFoldersForm ? "hidden" : ""
            }`}
          >
            {folders.map((folder, idx) => (
              <button
                className="p-4 mx-4 my-2 bg-blue-300"
                key={`folder-${idx}`}
              >
                {folder.name}
              </button>
            ))}
          </div>
          <hr className="border border-white w-full" />
        </>
      )}
      <div
        className={`flex flex-col items-center justify-center h-full w-full ${
          showNotesForm || showFoldersForm ? "hidden" : ""
        }`}
      >
        {notes.length === 0 ? <AddNote /> : <NotesList notes={notes} />}
        <AddButton
          handleAddNote={() => setShowNotesForm(true)}
          handleAddFolder={() => setShowFoldersForm(true)}
        />
      </div>
    </>
  );
};
