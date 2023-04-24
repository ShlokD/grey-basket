import type { Note } from "./types";
import { useState } from "preact/hooks";

export const NotesList = ({
  notes,
  onDeleteNote,
  onUpdateNote,
}: {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, isFavorited: boolean) => void;
}) => (
  <div className="flex flex-col items-center justify-start w-full h-full">
    {notes.map((note, idx) => (
      <div
        className="bg-yellow-300 p-2 my-2 w-10/12 rounded-lg text-black"
        key={`note-${idx}`}
      >
        <p className="text-lg font-bold">{note.title}</p>
        <p className="my-2">{note.description}</p>
        <button onClick={() => onDeleteNote(note.id)} aria-label="Delete Note">
          <img src="/trash.png" height="24" width="24" alt="" />
        </button>
        <button
          className="mx-2"
          onClick={() => onUpdateNote(note.id, !note.favorite)}
          aria-label={`${note.favorite ? "Unfavorite Note" : "Favorite Note"}`}
        >
          <img
            src={`${note.favorite ? "/crosscircle.png" : "/star.png"}`}
            height="24"
            width="24"
            alt=""
          />
        </button>
      </div>
    ))}
  </div>
);

export const NotesForm = ({
  onClose,
  onCancel,
}: {
  onClose: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => void;
  onCancel: () => void;
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

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    onCancel();
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
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4 mx-2"
          onClick={handleClose}
        >
          Save
        </button>
        <button
          className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4 mx-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
