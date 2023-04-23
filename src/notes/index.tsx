import { useAppContext } from "../context";
import { useEffect, useState } from "preact/hooks";

type Note = {
  id: number;
  title: string;
  description: string;
  folder: string;
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

const addNoteToDB = (db: IDBDatabase, note: Note) => {
  const store = db.transaction("notes", "readwrite").objectStore("notes");
  store.add(note, note.id);
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
        className="bg-yellow-300 p-4 rounded-lg w-11/12 m-4 placeholder-gray text-black"
        value={title}
        onChange={(ev) => setTitle((ev?.target as HTMLInputElement)?.value)}
        placeholder="Title"
      />
      <textarea
        className="bg-yellow-300 p-4 rounded-lg w-11/12 h-11/12 text-black"
        value={description}
        onChange={(ev) =>
          setDescription((ev?.target as HTMLTextAreaElement)?.value)
        }
        placeholder="Text"
        rows={13}
      />
      <button
        className="bg-blue-300 text-black font-bold rounded-lg p-4 my-4"
        onClick={handleClose}
      >
        Save
      </button>
    </div>
  );
};
export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const { db } = useAppContext();

  const getNotesFromDb = async () => {
    if (db) {
      const notesFromDB = await getNotes(db);
      setNotes(notesFromDB);
    }
  };

  const onClose = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const note = { id: notes.length + 1, folder: "", title, description };
    setNotes((prev) => [...prev, note]);
    setShowNotesForm(false);
    if (db) {
      addNoteToDB(db, note);
    }
  };

  useEffect(() => {
    if (db) {
      getNotesFromDb();
    }
  }, [db]);

  return (
    <>
      {
        <div className={`${showNotesForm ? "inline-block" : "hidden"}`}>
          <NotesForm onClose={onClose} />
        </div>
      }
      <div
        className={`flex flex-col items-center justify-center h-full w-full ${
          showNotesForm ? "hidden" : ""
        }`}
      >
        {notes.length === 0 ? <AddNote /> : <NotesList notes={notes} />}
        <button
          aria-label="Add a Note"
          className="px-6 py-4 bg-blue-300 my-4 text-5xl rounded-full fixed bottom-32 z-auto right-4"
          onClick={() => setShowNotesForm(true)}
        >
          +
        </button>
      </div>
    </>
  );
};
