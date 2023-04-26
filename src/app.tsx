import { Route, Router } from "preact-router";
import { AppContextProvider } from "./context";
import Favorites from "./favs";
import Footer from "./footer";
import Header from "./header";
import Notes from "./notes";
import SearchResults from "./search-results";

export function App() {
  return (
    <>
      <AppContextProvider>
        <Header />
        <main className="flex flex-col h-auto w-full">
          <Router>
            <Route path="/" component={Notes} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/search" component={SearchResults} />
          </Router>
        </main>
        <Footer />
      </AppContextProvider>
    </>
  );
}
