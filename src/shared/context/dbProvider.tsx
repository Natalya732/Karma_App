import { createContext, useContext } from "react";
import { useIndexedDB, type useIndexedResult } from "../hooks/useIndexedDB";
import { Database } from "../utils/constants";

const DBContext = createContext<useIndexedResult>({} as useIndexedResult);

export function DBProvider({ children }: { children: React.ReactNode }) {
  // const tables = useMemo(() => [Database.boardTable, Database.taskTable], []);

  // const db = useIndexedDB(Database.name, tables);
  const db = useIndexedDB(Database.name);

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>;
}

export const useDb = () => {
  const context = useContext(DBContext);
  if (!context) {
    console.log("outside context");
  }

  return context;
};
