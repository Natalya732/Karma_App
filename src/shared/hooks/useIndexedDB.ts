import { useCallback, useEffect, useState } from "react";
import { Database } from "@/shared/utils/constants";

export interface useIndexedResult {
  getTableValue: (tableName: string, id: number) => Promise<any>;
  getAllValue: (tableName: string) => Promise<any[]>;
  putValue: (tableName: string, value: object) => Promise<IDBValidKey | null>;
  putBulkValue: (tableName: string, value: object[]) => Promise<any[]>;
  updateValue: (params: {
    tableName: string;
    id: number;
    newItem: any;
  }) => void;
  deleteValue: (tableName: string, id: number) => number | undefined;
  deleteAll: (tableName: string) => void;
  isDbConnecting: boolean;
}

export const useIndexedDB = (
  databaseName: string,
  // tableNames: string[]
): useIndexedResult => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isDbConnecting, setIsDbConnecting] = useState<boolean>(true);

  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open(databaseName, Database.version);
      request.onupgradeneeded = () => {
        const database = request.result;

        database.onversionchange = () => {
          database.close();
        };

        [Database.boardTable, Database.taskTable].forEach((tableName) => {
          if (!database.objectStoreNames.contains(tableName)) {
            database.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: "id",
            });
          }
        });
      };
      request.onsuccess = () => {
        request.result.onversionchange = () => {
          request.result.close();
        };
        setDb(request.result);
        setIsDbConnecting(false);
      };

      request.onerror = () => {
        console.error("Error initializing IndexedDB:", request.error);
        setIsDbConnecting(false);
      };
    };

    if (!db) {
      initDB();
    }
  }, []);

  //   Get transaction for a specific table
  const getTableTransaction = (tableName: string, mode: IDBTransactionMode) => {
    if (!db) throw new Error("Database is not initialized");
    return db.transaction(tableName, mode).objectStore(tableName);
  };

  //   Function to get a specific value from the table by ID
  const getTableValue = useCallback(
    (tableName: string, id: number): Promise<any> => {
      return new Promise((resolve, reject) => {
        try {
          const store = getTableTransaction(tableName, "readwrite");
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (err) {
          reject(err);
        }
      });
    },
    [db]
  );

  // Function to get all values from a specific table
  const getAllValue = useCallback(
    (tableName: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        try {
          const store = getTableTransaction(tableName, "readonly");
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (err) {
          console.log("error", err);
          reject(err);
        }
      });
    },
    [db]
  );

  //   Function to insert or update a single value in a specific table

  const putValue = (
    tableName: string,
    value: object
  ): Promise<IDBValidKey | null> => {
    return new Promise((resolve, reject) => {
      try {
        const store = getTableTransaction(tableName, "readwrite");
        const request = store.put(value);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (err) {
        console.log("erro", err);
        reject(err);
      }
    });
  };

  // Function to insert or update multiple values in a specific table
  const putBulkValue = async (
    tableName: string,
    values: object[]
  ): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      try {
        const store = getTableTransaction(tableName, "readwrite");
        values.forEach((value) => store.put(value));
        resolve(getAllValue(tableName));
      } catch (err) {
        console.log("error", err);
        reject(err);
      }
    });
  };

  // Function to update a specific value by ID in a specific table

  const updateValue = ({
    tableName,
    id,
    newItem,
  }: {
    tableName: string;
    id: number;
    newItem: any;
  }) => {
    try {
      const store = getTableTransaction(tableName, "readwrite");
      const request = store.get(id);
      request.onsuccess = () => {
        const data = request.result;
        const updatedItem = data ? { ...data, ...newItem } : { id, newItem };
        store.put(updatedItem);
      };
    } catch (err) {
      console.log("Update value failed", err);
    }
  };

  const deleteValue = (tableName: string, id: number): number | undefined => {
    try {
      const store = getTableTransaction(tableName, "readwrite");
      store.delete(id);
      return id;
    } catch (err) {
      console.log("delete error", err);
    }
  };

  const deleteAll = (tableName: string) => {
    try {
      const store = getTableTransaction(tableName, "readwrite");

      store.clear();
    } catch (err) {
      console.log("all delete", err);
    }
  };

  return {
    getTableValue,
    getAllValue,
    putValue,
    putBulkValue,
    updateValue,
    deleteValue,
    deleteAll,
    isDbConnecting,
  };
};
