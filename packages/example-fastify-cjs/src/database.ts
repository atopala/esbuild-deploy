import * as path from "node:path";
import Database from "better-sqlite3";
import camelcaseKeys from "camelcase-keys";
import * as fs from "node:fs";

const DB_FILE_PATH = path.resolve("db/test.sqlite");

export function init() {
   const dir = path.dirname(DB_FILE_PATH);
   try {
      fs.accessSync(dir);
   } catch (err) {
      console.warn(err);

      console.log("Creating db folder: ", dir);

      fs.mkdirSync(path.dirname(DB_FILE_PATH));
   }

   let db = undefined;
   try {
      db = new Database(DB_FILE_PATH, {
         fileMustExist: false,
         readonly: false,
      });

      db.prepare(
         `
         CREATE TABLE IF NOT EXISTS Person (
            person_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now', 'localtime')) NOT NULL
         );
      `,
      ).run();

      db.prepare("INSERT INTO Person (first_name, last_name) VALUES ('John', 'Doe');").run();
   } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
   } finally {
      db?.close();
   }
}

export interface PersonRow {
   personId: number;
   firstName: string;
   lastName: string;
   createdAt: string;
}

export interface Person {
   person_id: number;
   first_name: string;
   last_name: string;
   created_at: string;
}

export function getPersons(): Person[] {
   const db = new Database(DB_FILE_PATH, {
      fileMustExist: true,
      readonly: true,
   });

   try {
      const stmt = db.prepare<[], Record<string, unknown>>("SELECT * FROM Person");
      return stmt.all().map(toCamelCase) as unknown as Person[];
   } catch (error) {
      console.error("Error fetching persons:", error);
      throw error;
   } finally {
      db?.close();
   }
}

const toCamelCase = (obj: Record<string, unknown>) => camelcaseKeys(obj, { deep: true });
