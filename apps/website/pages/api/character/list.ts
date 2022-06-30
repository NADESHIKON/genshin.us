import { getCharacters } from "@/lib/api/wrapper";

export default async (req, res) => {
    return res.status(200).json(await getCharacters());
}
