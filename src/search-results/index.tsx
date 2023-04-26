import { useAppContext } from "../context";
import { NotesList } from "../shared/notes";

const SearchResults = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = (urlParams.get("q") || "")?.toLowerCase();
  const { db, notes, handleDeleteNote, handleUpdateNote } = useAppContext();

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
  );

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
      No Results Found
    </h2>
  );
};

export default SearchResults;
