import Scraper from "../scraper";

import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
const database = admin.firestore();

import dayjs from "dayjs";

import fetch from "node-fetch";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

const BASE_DOMAIN = "https://genshin-impact.fandom.com";
import * as cheerio from 'cheerio';

export default class WishScraper extends Scraper {

    async preload() {
        const response = await (await fetch(BASE_DOMAIN)).text();
        let $ = cheerio.load(response);

        const banners = $($(".events-gallery")[1]).find("tr").last().find(".wikia-gallery-item");

        const characterBanners = [], weaponBanners = [];
        if (banners.length >= 5) { // 2 character banners
            characterBanners.push(banners[0]);
            characterBanners.push(banners[1]);
            weaponBanners.push(banners[2]);
        } else {
            characterBanners.push(banners[0]);
            weaponBanners.push(banners[1]);
        }

        return {
            character: characterBanners.map(banner => this.parseBannerInformation(banner, $)),
            weapon: weaponBanners.map(banner => this.parseBannerInformation(banner, $))
        }
    }

    async scrape(data) {
        let characters = [], weapons = [];

        let index = 0;

        for (let character of data.character) {
            const characterResponse = await (await fetch(BASE_DOMAIN + character.link)).text();
            let $ = cheerio.load(characterResponse);

            let name = $("#firstHeading").text().trim().split(" ").map(a => a.replace(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/ig, "")).join(" ").trim();

            let range = $("div .nomobile :contains('Duration')").first().text().split("\n")[0].replace("Duration: ", "").split(" – ");

            let format = 'MMMM DD, YYYY HH:mm:ss A';
            let from = dayjs(range[0], format).toDate(), to = dayjs(range[1], format).toDate();

            let image = $(".image").first().attr("href");

            characters[index] = {
                ...character,
                name: name,
                image: image,
                time: {
                  from: from.getTime(),
                  to: to.getTime()
                },
                promotional: Array.from($($(".wikitable").first().find("tr")[1]).find("td").first().find(".card_image")).map(e => $(e).find("a").first().attr("title"))
            };
            index++;
        }

        index = 0;

        for (let weapon of data.weapon) {
            const weaponResponse = await (await fetch(BASE_DOMAIN + weapon.link)).text();
            let $ = cheerio.load(weaponResponse);

            let name = $("#firstHeading").text().trim().split(" ").map(a => a.replace(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/ig, "")).join(" ").trim();

            let range = $("div .nomobile :contains('Duration')").first().text().split("\n")[0].replace("Duration: ", "").split(" – ");

            let image = $(".image").first().attr("href");

            let format = 'MMMM DD, YYYY HH:mm:ss A';
            let from = dayjs(range[0].trim(), format).toDate(), to = dayjs(range[1].trim(), format).toDate();

            weapons[index] = {
                ...weapon,
                name: name,
                image: image,
                time: {
                    from: from.getTime(),
                    to: to.getTime()
                },
                promotional: Array.from($($(".wikitable").first().find("tr")[1]).find("td").first().find(".card_image")).map(e => $(e).find("a").first().attr("title"))
            }

            index++;
        }

        return {
            ...data,
            character: characters,
            weapon: weapons
        };
    }

    async loadToDatabase(data) {
        const currentCharacterBanner = database.collection("current-banners").doc("character");
        const currentWeaponBanner = database.collection("current-banners").doc("weapon");

        let characterInformation = [], weaponInformation = [];

        console.log(data)
        for (let character of data.character) {
            const characterImage = character.image;
            const characterImageFileName = Scraper.EXTERNAL_FILE_REGEX.exec(characterImage).groups.filename.replace("Wish_", "");
            await this.saveImageToStorage(this.transformRawUrl(characterImage), `banners/character/${decodeURIComponent(characterImageFileName)}`);

            characterInformation.push({
                ...character,
                image: `banners/character/${characterImageFileName}`
            });
        }

        for (let weapon of data.weapon) {
            const weaponImage = weapon.image;
            const weaponImageFileName = Scraper.EXTERNAL_FILE_REGEX.exec(weaponImage).groups.filename.replace("Wish_", "");
            await this.saveImageToStorage(this.transformRawUrl(weaponImage), `banners/weapon/${decodeURIComponent(weaponImageFileName)}`);

            weaponInformation.push({
                ...weapon,
                image: `banners/weapon/${weaponImageFileName}`
            })
        }

        await currentCharacterBanner.set({
            time: {
                from: characterInformation[0].time.from,
                to: characterInformation[0].time.to,
            },
            information: characterInformation
        });

        await currentWeaponBanner.set({
            time: {
                from: weaponInformation[0].time.from,
                to: weaponInformation[0].time.to,
            },
            information: weaponInformation
        });
    }

    parseBannerInformation(banner, $) {
        const links = $(banner).find("a");
        const image = $(links[0]).find("img")[0];

        return {
            // name: $(links[1]).text().replace(/[\n\r]/g, "").replace(/\(.*\)/g, ""),
            link: $(links[0]).attr("href"),
            // image: $(image).attr("src")
        }
    }

}
