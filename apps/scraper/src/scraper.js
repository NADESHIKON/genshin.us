import admin from "firebase-admin";
import fetch from "node-fetch";
if (!admin.apps.length) admin.initializeApp();
const bucket = admin.storage().bucket("asset.genshin.us");

export default class Scraper {
    static EXTERNAL_FILE_REGEX = /https:\/\/static\.wikia\.nocookie\.net\/gensin-impact\/images\/(.{1,2})\/(.{1,2})\/(?<filename>[A-Za-z0-9_,.\-'"%\(\)♪!?]*)/;

    async preload() {}

    async scrape(preload) {}

    async loadToDatabase(data) {}

    transformRawUrl(url) {
        url = decodeURIComponent(url);

        return url.substring(0, url.indexOf('/revision/latest'));
    }

    async saveImageToStorage(url, path) {
        const file = bucket.file(path);
        if ((await file.exists())[0]) return;

        const response = await fetch(encodeURI(url).replace(/%5B/g, '[').replace(/%5D/g, ']'));
        const fileWriteStream = file.createWriteStream({
            metadata: {
                "Content-Type": response.headers.get("content-type")
            }
        });

        return response.body.pipe(fileWriteStream);
    }

    innerText(el) {
        el = el.cloneNode(true);
        el.querySelectorAll('script,style').forEach(s => s.remove());
        return el.textContent;
    }
}
