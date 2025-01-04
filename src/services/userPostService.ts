import { sql } from 'drizzle-orm';
import { db } from '../lib/db'; // Assuming db and sql are set up in a separate database file.


export class UserPostService {
    // Find records with pagination, filters, and sorting.
    public static async findAll({
        dbName, offset, limit, filters, sort
    }: { 
        dbName: string; 
        offset: number; 
        limit: number; 
        filters?: string; 
        sort?: string; 
    }) {
        const query = db.select().from(sql`${dbName}`); // Use dynamic dbName here
        console.log(filters)
        // if (filters) {
        //     query.where(sql`${sql.raw(filters)}`);
        // }
        // if (sort) {
        //     query.orderBy(sql`${sql.raw(sort)}`);
        // }
        query.limit(limit).offset(offset);
        const data = await query.execute();
        return data;
    }

    // Get the count of records based on filters
    public static async getCount({ dbName, filters }: { dbName: string; filters?: string }) {
        const query = db.select({ count: sql<number>`COUNT(*)` }).from(sql`${dbName}`);
        if (filters) {
            query.where(sql`${sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].count;
    }
}
