import { firestore } from '@/lib/api/firebase';

export default async (req, res) => {
    let changelogReference = await (firestore.collection("changelogs").get());
    const changelogs = [];

    changelogReference.forEach(c => changelogs.push(c.data()));

    return res.status(200).json(changelogs.sort((a, b) => -(Date.parse(a.date) - Date.parse(b.date))));
}
