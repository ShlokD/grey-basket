import { useEffect, useState } from "preact/hooks";
import { v4 } from "uuid";
import { useAppContext } from "../context";
import {
  addFolderToDb,
  addNoteToDB,
  deleteFolderFromDB,
  getFolders,
} from "../shared/db-utils";
import { NotesForm, NotesList } from "../shared/notes";
import type { Folder, Note } from "../types";
import { AddButton } from "./add-button";
import { FolderForm, FolderList } from "./folder";

const AddNote = () => (
  <h2 className="font-bold text-yellow-300 text-3xl text-center">
    Create your first note
  </h2>
);

export const Notes = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showFoldersForm, setShowFoldersForm] = useState(false);
  const { currentFolder, setCurrentFolder } = useAppContext();

  const { db, notes, setNotes, handleDeleteNote, handleUpdateNote } =
    useAppContext();

  const getFoldersFromDb = async () => {
    if (db) {
      const foldersFromDb = await getFolders(db);
      setFolders(foldersFromDb);
    }
  };

  const handleFolderClick = (name: string) => {
    setCurrentFolder(name);
  };

  const handleFolderDelete = async (folder: Folder) => {
    const newFolders = folders.filter((f) => f.name !== folder.name);
    setCurrentFolder(folders[0].name);
    setFolders(newFolders);
    if (db) {
      deleteFolderFromDB(
        db,
        folder.id,
        notes.filter((note) => note.folder === folder.name)
      );
    }
  };

  const onAddNote = ({
    title,
    description,
    bgColor,
  }: {
    title: string;
    description: string;
    bgColor: string;
  }) => {
    const note = {
      id: v4(),
      folder: currentFolder,
      title,
      description,
      bgColor,
    };
    setNotes((prev: Note[]) => [...prev, note]);
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

  useEffect(() => {
    if (db) {
      getFoldersFromDb();
    }
  }, [db]);

  const filteredNotes = notes.filter((note) => note.folder === currentFolder);

  if (!db) {
    return (
      <h2 className="font-bold text-yellow-300 text-3xl text-center">
        Loading...
      </h2>
    );
  }

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
          handleFolderDelete={handleFolderDelete}
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

export default Notes;
