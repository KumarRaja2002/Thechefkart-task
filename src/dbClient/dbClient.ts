import { db } from "../lib/db";
import { DBRecord, DBTable, NewDBRecord } from "../utils/types";
import { eq, getTableName, sql,and,ne } from "drizzle-orm";

const addSingleRecord = async<R extends DBRecord> (tableName:DBTable, data: NewDBRecord) => {
    const responseData = await db.insert(tableName).values(data).returning();
    return responseData[0] as R;
}
  
const getRecordByColumn = async <R extends DBRecord>(tableName: DBTable, column: string, value: string | number): Promise<R | null> => {
    const columnInfo = sql.raw(`${getTableName(tableName)}.${column}`);
    const record = await db.select().from(tableName).where(eq(columnInfo, value));
    return record[0] ? (record[0] as R) : null;
}

const getRecordsByColumn = async <R extends DBRecord>(
    tableName: DBTable,
    column: string,
    value: string | number
): Promise<R[]> => {
    const columnInfo = sql.raw(`${getTableName(tableName)}.${column}`);
    const records = await db.select().from(tableName).where(eq(columnInfo, value));
    return records as R[];
};


const getAllRecords = async <R extends DBRecord>(tableName: DBTable): Promise<R[]> => {
    const records = await db.select().from(tableName);
    return records as R[];
}


const updateSingleRecord = async(tableName:DBTable, data: NewDBRecord, id: number) => {
    const responseData = await db
        .update(tableName)
        .set(data)
        .where(eq(tableName.id, id))
        .returning();
    return responseData[0];
}

const deleteSingleRecord = async (tableName:DBTable, id: number) => {
    return await db.delete(tableName).where(eq(tableName.id, id))
}

export {
    addSingleRecord,
    getRecordByColumn,
    updateSingleRecord,
    deleteSingleRecord,
    getAllRecords,
    getRecordsByColumn
}