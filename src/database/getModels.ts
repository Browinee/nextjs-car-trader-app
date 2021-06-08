import {openDB} from "../openDB";


export interface Model {
    model: string;
    count: number;
}

export default async function getModels(make: string){
    const db = await openDB();
    return await db.all<Model[]>(`
        SELECT model, count(*) as count
        FROM car
        WHERE make = @make
        GROUP BY model
    `, {
        "@make": make
    });
}
