import { useState } from "preact/hooks";
import type { Note } from "../types";

export const NotesList = ({
  notes,
  onDeleteNote,
  onUpdateNote,
}: {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, isFavorited: boolean) => void;
}) => (
  <div className="flex flex-col lg:flex-row lg:justify-center lg:items-stretch lg:flex-wrap py-4 items-center justify-start w-full h-full">
    {notes.map((note, idx) => (
      <div
        className={`${
          note.bgColor || "bg-yellow-300"
        } p-2 my-2 w-10/12 lg:w-4/12 rounded-lg text-black lg:mx-4`}
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

const colors = ["bg-yellow-300", "bg-blue-300", "bg-white", "bg-green-100"];

export const NotesForm = ({
  onClose,
  onCancel,
}: {
  onClose: ({
    title,
    description,
    bgColor,
  }: {
    title: string;
    description: string;
    bgColor: string;
  }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState(colors[0]);

  const handleClose = () => {
    if (!title && !description) {
      return;
    }
    onClose({ title, description, bgColor });
    setTitle("");
    setDescription("");
    setBgColor(colors[0]);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setBgColor(colors[0]);
    onCancel();
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full my-2">
      <input
        className={`${bgColor} p-4 rounded-lg w-11/12 m-4 placeholder-gray text-black`}
        value={title}
        onChange={(ev) => setTitle((ev?.target as HTMLInputElement)?.value)}
        placeholder="Title"
        aria-label="Enter note title"
      />
      <textarea
        className={`${bgColor} p-4 rounded-lg w-11/12 h-11/12 text-black`}
        value={description}
        onChange={(ev) =>
          setDescription((ev?.target as HTMLTextAreaElement)?.value)
        }
        placeholder="Text"
        rows={13}
        aria-label="Enter note text"
      />
      <div className="flex my-2 justify-around">
        {colors.map((color, idx) => {
          const checked = color === bgColor;
          return (
            <div className="flex">
              <label
                for={`bg-color-${color}`}
                htmlFor={`bg-color-${color}`}
                style={{ height: "36px", width: "36px" }}
                className={`${color} mx-2 rounded-full ${
                  checked ? "border border-orange-500 border-8" : ""
                }`}
              />
              <input
                type="radio"
                className="hidden"
                id={`bg-color-${color}`}
                key={`bg-color-${idx}`}
                value={color}
                name="bg-color"
                checked={checked}
                onClick={() => setBgColor(color)}
                onKeyDown={(ev) => {
                  if (ev.keyCode === 13) {
                    setBgColor(color);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
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
