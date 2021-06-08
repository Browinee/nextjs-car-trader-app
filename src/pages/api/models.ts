import getModels from "../../database/getModels";
import {NextApiRequest, NextApiResponse} from "next";
import {getAsString} from "../../utils/getAsString";

export default async function models(req: NextApiRequest, res: NextApiResponse) {
    const make = getAsString(req.query.make);
    const models = await getModels(make);
    res.json(models);
}