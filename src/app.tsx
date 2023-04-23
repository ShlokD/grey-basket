import Header from "./header";
import { AppContextProvider } from "./context";
import Footer from "./footer";
import { Notes } from "./notes";
import type { JSX } from "preact";

const Favs = () => <div>Favs</div>;
const Reminders = () => <div>Reminders</div>;

const views: Record<string, () => JSX.Element> = {
  favorites: Favs,
  reminders: Reminders,
};

export function App() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("q");
  const View = page ? views[page] : Notes;
  return (
    <>
      <AppContextProvider>
        <Header />
        <main className="flex flex-col h-full w-full">
          <View />
        </main>
        <Footer />
      </AppContextProvider>
    </>
  );
}
