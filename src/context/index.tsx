import { createContext, JSX } from "preact";
import { useContext, useState } from "preact/hooks";

type AppContextType = {
  db?: IDBDatabase;
};
const AppContext = createContext<AppContextType>({});

export const useAppContext = () => useContext(AppContext);

const createDB = (): Promise<IDBDatabase | null> => {
  if ("indexedDB" in window) {
    const request = window.indexedDB.open("notes-db", 1);

    const p = new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = (ev: Event) => {
        const db = (ev?.target as IDBOpenDBRequest)?.result;
        resolve(db);
      };
      request.onerror = (err) => {
        reject(err);
      };

      request.onupgradeneeded = (ev: Event) => {
        const db = (ev?.target as IDBOpenDBRequest)?.result;
        db?.createObjectStore("notes");
        db?.createObjectStore("folders");
        resolve(db);
      };
    });
    return p;
  }

  return Promise.resolve(null);
};

export const AppContextProvider = ({
  children,
}: {
  children?: JSX.Element[];
}) => {
  const [db, setDB] = useState<IDBDatabase>();

  const createAndSetDB = async () => {
    const dbHandle = await createDB();
    if (dbHandle) {
      setDB(dbHandle);
    }
  };

  if (!db) {
    createAndSetDB();
  }

  return <AppContext.Provider value={{ db }}>{children}</AppContext.Provider>;
};
