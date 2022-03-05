export default async (req, res) => {
    if (req.method !== "POST") return res.status(401).send("Only POST is valid");

    const clientKey = req.headers["x-api-key"];
    const serverKey = process.env.WEBHOOK_PRIVATE_KEY;

    if (clientKey !== serverKey) return res.status(403).send("Invalid private key");

    const body = JSON.parse(req.body);

    const types = body.types;

    try {
        for (const type of types) {
            await res.unstable_revalidate(type);
        }

        return res.status(200).send("Success");
    } catch (e) {
        return res.error().send("Error", e);
    }
}
