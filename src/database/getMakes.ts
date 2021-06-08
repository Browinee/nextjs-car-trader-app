import {openDB} from "../openDB";


export interface Make {
    make: string;
    count: number;
}

export default async function getMakes(){
    const db = await openDB();
    return await db.all<Make[]>(`
        SELECT make, count(*) as count
        FROM car
        GROUP BY make
    `);
}