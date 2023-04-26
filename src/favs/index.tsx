import { useAppContext } from "../context";
import { NotesList } from "../shared/notes";
const Favorites = () => {
  const { db, notes, handleDeleteNote, handleUpdateNote } = useAppContext();

  const filteredNotes = notes.filter((note) => !!note.favorite);

  if (!db) {
    return (
      <h2 className="font-bold text-yellow-300 text-3xl text-center">
        Loading...
      </h2>
    );
  }

  return filteredNotes.length > 0 ? (
    <NotesList
      notes={filteredNotes}
      onDeleteNote={handleDeleteNote}
      onUpdateNote={handleUpdateNote}
    />
  ) : (
    <h2 className="font-bold text-yellow-300 text-3xl text-center">
      See your favorite notes here
    </h2>
  );
};

export default Favorites;
