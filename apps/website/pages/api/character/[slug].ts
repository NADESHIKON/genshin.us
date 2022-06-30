import { getCharacter } from "@/lib/api/wrapper";

interface Response {
    code: number,
    response: string
}

const INVALID_CHARACTER_ID: Response = {
    code: 400,
    response: "Invalid character ID"
};

const CHARACTER_DOES_NOT_EXIST: Response = {
    code: 404,
    response: "Character does not exist"
};

export default async (req, res) => {
    const name = req.query.slug;

    if (!name) return res.status(400).json(INVALID_CHARACTER_ID);

    const character = await getCharacter(name, !!(req.query && (req.query.basic === 'true')));
    if (!character) return res.status(404).json(CHARACTER_DOES_NOT_EXIST);

    return res.status(200).json(character);
}
