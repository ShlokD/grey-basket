import { createContext, JSX } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({
  children,
}: {
  children?: JSX.Element[];
}) => {
  const [db, setDB] = useState<IDBDatabase>();

  useEffect(() => {
    if ("indexedDB" in window) {
      const request = window.indexedDB.open("notes-db", 1);

      request.onsuccess = (ev: Event) => {
        setDB((ev?.target as IDBOpenDBRequest)?.result);
      };

      request.onupgradeneeded = (ev: Event) => {
        const db = (ev?.target as IDBOpenDBRequest)?.result;
        db?.createObjectStore("notes", { keyPath: "id" });
        db?.createObjectStore("folders", { keyPath: "id" });
        setDB(db);
      };
    }
  }, []);

  return <AppContext.Provider value={{ db }}>{children}</AppContext.Provider>;
};
