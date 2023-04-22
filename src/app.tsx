import Header from "./header";
import { AppContextProvider } from "./context";
import Footer from "./footer";

export function App() {

  /* const addDataOnClick = () => {
    const transaction = db.transaction(["notes"], "readwrite");
    const store = transaction.objectStore("notes");
    const newNote = { id: idx++, folder: "", title: "Foo", description: "Bar" };
    store.add(newNote, newNote.id);
  };*/

  return (
    <>
      <AppContextProvider>
        <Header />
        <p>Create your first note</p>
        <Footer />
      </AppContextProvider>
    </>
  );
}
