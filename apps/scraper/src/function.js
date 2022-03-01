import * as functions from "firebase-functions";
import express from "express";
const app = express();

import CharacterScraper from "./impl/character-scraper";
import WishScraper from "./impl/wish-scraper";
import WeaponScraper from "./impl/weapon-scraper";
import ArtifactScraper from './impl/artifact-scraper';

const API_KEY = "04fbe5f7-5c16-430b-8345-c3c563e4da74";

const runtimeOpts = {
    memory: '256MB',
    timeoutSeconds: 500
}

app.post('/refresh/character', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");

    res.status(200).end("OK");

    const characterScraper = new CharacterScraper();

    let preloadData = await characterScraper.preload();
    const promises = [];

    preloadData.forEach(preload => promises.push(characterScraper.scrape(preload)));

    let data = (await Promise.all(promises)).filter(e => e !== undefined);

    for (let character of data) {
        await characterScraper.loadToDatabase(character, true);
    }
});

app.post('/refresh/character/:name', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");

    res.status(200).end("OK");

    const characterScraper = new CharacterScraper();
    const preloadData = await characterScraper.preload(req.params.name);

    const promises = [];

    preloadData.forEach(preload => promises.push(characterScraper.scrape(preload)));

    const data = (await Promise.all(promises)).filter(e => e !== undefined);

    if (data.length <= 0) return res.status(404).end("No character to refresh");

    await characterScraper.loadToDatabase(data[0], true);
    //return res.status(200).end("OK");
});

const refreshWeapons = async () => {
    const weaponScraper = new WeaponScraper();
    const preloadData = await weaponScraper.preload();

    const promises = [];

    preloadData.forEach(preload => promises.push(weaponScraper.scrape(preload, true)));

    const data = (await Promise.all(promises)).filter(e => e !== undefined);

    for (let datum of data) {
        await weaponScraper.loadToDatabase(datum, true);
    }
}

app.post('/refresh/weapons', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");

    res.status(200).end("OK");

    await refreshWeapons();
});

const refreshBanners = async () => {
    const wishScraper = new WishScraper();
    const preloadData = await wishScraper.preload();

    const data = await wishScraper.scrape(preloadData);

    if (data.length <= 0) return res.status(404).end("No banner to refresh");

    await wishScraper.loadToDatabase(data, true);
}

app.post('/refresh/banners', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");
    res.status(200).end("OK");

    await refreshBanners();
});

const refreshArtifacts = async () => {
    const artifactScraper = new ArtifactScraper();
    const preloadData = await artifactScraper.preload();

    const promises = [];

    preloadData.forEach(preload => promises.push(artifactScraper.scrape(preload)));

    const data = (await Promise.all(promises)).filter(e => e !== undefined);

    if (data.length <= 0) return res.status(404).end("No artifact to refresh");

    for (let datum of data) {
        await artifactScraper.loadToDatabase(datum, true);
    }
}

app.post('/refresh/artifacts', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");

    res.status(200).end("OK");

    await refreshArtifacts();
});

app.post('/refresh', async (req, res) => {
    if (req.body !== API_KEY) return res.status(402).end("Unauthorized");
    res.status(200).end("OK");

    await refreshAll();
});

exports.app = functions.runWith(runtimeOpts).https.onRequest(app);

const refreshAll = async () => {
    console.log("Daily character update started...");
    let start = Date.now();

    const characterScraper = new CharacterScraper();

    console.log("Attempting to preload all characters from Fandom...");
    let preloadData = await characterScraper.preload();
    const promises = [];

    preloadData.forEach(preload => promises.push(characterScraper.scrape(preload)));

    let data = (await Promise.all(promises)).filter(e => e !== undefined);
    console.log("Preload success! Found " + data.length + " valid characters!");

    console.log("Trying to scrape characters...");

    for (let character of data) {
        console.log("Starting fetching data for " + character.name);
        await characterScraper.loadToDatabase(character, true);
        console.log("Finished fetching data for " + character.name);
    }

    console.log("Finished character daily update! Spent " + (Date.now() - start) + "ms!");

    console.log("Daily artifact update started...");
    start = Date.now();
    await refreshArtifacts()
    console.log("Finished banner daily update! Spent " + (Date.now() - start) + "ms!");

    console.log("Daily weapon update started...");
    start = Date.now();
    await refreshWeapons();
    console.log("Finished banner daily update! Spent " + (Date.now() - start) + "ms!");

    console.log("Daily banner update started...");
    start = Date.now();
    await refreshBanners()
    console.log("Finished banner daily update! Spent " + (Date.now() - start) + "ms!");
}

export const scheduledCharacterUpdate = functions.runWith(runtimeOpts).pubsub.schedule("0 0 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async context => {
        let start = Date.now();
        const characterScraper = new CharacterScraper();

        let preloadData = await characterScraper.preload();
        const promises = [];

        preloadData.forEach(preload => promises.push(characterScraper.scrape(preload)));

        let data = (await Promise.all(promises)).filter(e => e !== undefined);
        console.log("Preload success! Found " + data.length + " valid characters!");

        console.log("Trying to scrape characters...");

        for (let character of data) {
            console.log("Starting fetching data for " + character.name);
            await characterScraper.loadToDatabase(character, true);
            console.log("Finished fetching data for " + character.name);
        }

        console.log("Finished character daily update! Spent " + (Date.now() - start) + "ms!");
    });

export const scheduledWeaponUpdate = functions.runWith(runtimeOpts).pubsub.schedule("0 0 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async context => {
        console.log("Daily weapon update started...");
        let start = Date.now();
        await refreshWeapons();
        console.log("Finished banner daily update! Spent " + (Date.now() - start) + "ms!");
    });

export const scheduledArtifactUpdate = functions.runWith(runtimeOpts).pubsub.schedule("0 0 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async context => {
        console.log("Daily artifact update started...");
        let start = Date.now();
        await refreshArtifacts();
        console.log("Finished artifact daily update! Spent " + (Date.now() - start) + "ms!");
    });

export const scheduledBannerUpdate = functions.runWith(runtimeOpts).pubsub.schedule("0 0 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async context => {
        console.log("Daily banner update started...");
        let start = Date.now();
        await refreshBanners();
        console.log("Finished banner daily update! Spent " + (Date.now() - start) + "ms!");
    });
