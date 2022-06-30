import { getArtifact } from "@/lib/api/wrapper";

interface Response {
    code: number,
    response: string
}

const INVALID_ARTIFACT_ID: Response = {
    code: 400,
    response: "Invalid artifact ID"
};

const ARTIFACT_DOES_NOT_EXIST: Response = {
    code: 404,
    response: "Artifact does not exist"
};

export default async (req, res) => {
    const name = req.query.slug;

    if (!name) return res.status(400).json(INVALID_ARTIFACT_ID);

    const weapon = await getArtifact(name);
    if (!weapon) return res.status(404).json(ARTIFACT_DOES_NOT_EXIST);

    return res.status(200).json(weapon);
}
