import { createContext, useContext, useMemo } from "react";
import { useIndexedDB, type useIndexedResult } from "../hooks/useIndexedDB";
import { Database } from "../utils/constants";

const DBContext = createContext<useIndexedResult | null>(null);

export function DBProvider({ children }: { children: React.ReactNode }) {
 const tables = useMemo(() => [
  Database.boardTable,
  Database.taskTable
], []);

const db = useIndexedDB(Database.name, tables);

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>;
}

export const useDb = () => {
  const context = useContext(DBContext);
  if (!context) {
    console.log("outside context");
  }

  return context;
};
