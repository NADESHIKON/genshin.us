import { getWeapon } from "@/lib/api/wrapper";

interface Response {
    code: number,
    response: string
}

const INVALID_WEAPON_ID: Response = {
    code: 400,
    response: "Invalid weapon ID"
};

const WEAPON_DOES_NOT_EXIST: Response = {
    code: 404,
    response: "Weapon does not exist"
};

export default async (req, res) => {
    const name = req.query.slug;

    if (!name) return res.status(400).json(INVALID_WEAPON_ID);

    const weapon = await getWeapon(name);
    if (!weapon) return res.status(404).json(WEAPON_DOES_NOT_EXIST);

    return res.status(200).json(weapon);
}
