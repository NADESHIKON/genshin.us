import { firestore } from './firebase';

export const getCharacter = async (id, basic = false) => {
    let characterDocument, updated = false;
    let store;

    characterDocument = await firestore.collection("characters").doc(id).get();

    let data;

    if (!characterDocument.exists) return undefined;

    characterDocument = characterDocument.data();

    let constellations;
    let talents;

    let note;
    constellations = (await characterDocument.constellations.get()).data();
    talents = (await characterDocument.talents.get()).data();

    note = (await firestore.collection("character-notes").doc(id).get());

    if (!note.exists) note = {};
    else note = note.data();

    data = {
        ...characterDocument,
        constellations,
        talents,
        notes: note
    }

    data.constellations = Object.entries(data.constellations).map((val) => {
        // @ts-ignore
        return {...val[1], index: Number.parseInt(val[0].replace('c', ''))}
    }).sort((a, b) => a.index - b.index);

    data.talents = Object.entries(data.talents).map((val) => {
        // @ts-ignore
        return {...val[1], index: Number.parseInt(val[0])}
    }).sort((a, b) => a.index - b.index);

    return !basic ? data : {
        name: data.name,
        link: data.link,
        thumbnail: data.thumbnail
    };
}

export const getCharacters = async () => {
    let charactersDocument = (await firestore.collection("characters").get());

    let characters = [];

    charactersDocument.forEach(characterDocument => {
        let character = characterDocument.data();
        delete character.constellations;
        delete character.talents;

        characters.push(character);
    });

    return characters;
}

export const getWeapon = async (id) => {
    let weaponDocument =  await firestore.collection("weapons").doc(id).get(), updated = false;

    if (!weaponDocument.exists) return undefined;

    return weaponDocument.data();
}

export const getWeapons = async () => {
    let weaponDocument = (await firestore.collection("weapons").get());

    let weapons = [];

    weaponDocument.forEach(weaponDocument => {
        let weapon = weaponDocument.data();
        weapons.push(weapon);
    });

    return weapons;
}

export const getBanners = async () => {
    let bannersCollection = firestore.collection("current-banners");
    const characterBannerDocument = (await bannersCollection.doc("character").get()).data();
    const weaponBannerDocument = (await bannersCollection.doc("weapon").get()).data();

    return {
        character: characterBannerDocument,
        weapon: weaponBannerDocument
    };
}

export const getArtifact = async (id) => {
    let artifactDocument = await firestore.collection("artifacts").doc(id).get();

    if (!artifactDocument.exists) return undefined;

    return artifactDocument.data();
}

export const getArtifacts = async () => {
    let artifactDocument = (await firestore.collection("artifacts").get());

    let artifacts = [];

    artifactDocument.forEach(artifactDoc => {
        let artifact = artifactDoc.data();
        artifacts.push(artifact);
    });

    return artifacts;
}
