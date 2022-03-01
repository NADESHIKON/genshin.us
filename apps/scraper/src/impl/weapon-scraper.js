import Scraper from "../scraper";
import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
const database = admin.firestore();

import TurndownService from "turndown";

const turndown = new TurndownService();

import fetch from "node-fetch";

import * as cheerio from 'cheerio';

const BASE_DOMAIN = "https://genshin-impact.fandom.com";
const WEAPON_TYPES = [
    "Swords",
    "Polearms",
    "Catalysts",
    "Claymores",
    "Bows"
];

const reserved = [
    ...WEAPON_TYPES
];

export default class WeaponScraper extends Scraper {
    async preload() {
        const items = [];

        for (let weaponType of WEAPON_TYPES) {
            const response = await (await fetch(`https://genshin-impact.fandom.com/wiki/Category:${weaponType}`)).text();
            const $ = cheerio.load(response);
            Array.from($(".category-page__member-link")).forEach(element => {
               items.push($(element).attr("href"));
            });
        }

        return items;
    }

    async scrape(path) {
        if (reserved.some(e => path === `/wiki/${e}`)) return;

        try {
            const response = await (await fetch(`${BASE_DOMAIN}${path}`)).text();
            console.log(`${BASE_DOMAIN}${path}`)
            const $ = cheerio.load(response);

            const name = $($(".page-header__title")[0]).text().trim();
            const informationTable = $(".pi-data-value, .pi-font");

            const rarity = Number.parseInt($($(informationTable[1]).find("img")[0]).attr("alt").replace(/ Stars/g, ""));
            const type = $($(informationTable[0]).find("a")[0]).attr("title").toUpperCase();

            let lore = $("#Lore").parent();
            let dummy = lore.next();

            let loreText = [];

            if (lore.length > 0 && dummy.length > 0) {
                try {
                    while (dummy && dummy.prop("tagName").toUpperCase() !== "H2") {
                        loreText.push(dummy.text());
                        dummy = dummy.next();
                    }

                } catch (e) {
                    console.log(e);
                }
            }

            const attributeElement = $($($(".pi-smart-group-body, .pi-border-color")[0]).children(".pi-smart-data-value, .pi-data-value, .pi-font, .pi-item-spacing, .pi-border-color")[3]).find(".pi-smart-data-label, .pi-data-label, .pi-secondary-font, .pi-item-spacing, .pi-border-color");

            let attributeTypeString = $(attributeElement.length === 7 ? attributeElement[5] : attributeElement[6]).text().split(" - ");
            let attributeValueString = attributeElement[8] ? $(attributeElement[8]).text().split(" - ") : "";

            const attribute = {
                atk: {
                    from: Number.parseInt(attributeTypeString[0]),
                    to: Number.parseInt(attributeTypeString[1])
                },
                type: attributeElement.length === 5 ? 'UNKNOWN' : attributeElement.length === 7 ? 'NONE' : $(attributeElement[7]).text().replace(/[\d.-]/g, "").replace("\n", "").replace(/ /g, "_").toUpperCase()
            };

            if (attribute.type === 'UNKNOWN') return;

            if (attribute.type !== 'NONE' && attribute.type !== 'UNKNOWN') {
                attribute.value = {
                    from: Number.parseFloat(attributeValueString[0].replace(/%/g, "")),
                    to: Number.parseFloat(attributeValueString[1].replace(/%/g, "")),
                }
            } else {
                attribute.value = {
                    from: NaN,
                    to: NaN
                }
            }

            let refineIndex = 1;
            const refine = {};

            Array.from($(".wds-tab__content > .pi-item > .pi-horizontal-group")).forEach(e => {
                let rawRefineElement = $($(e).find(".pi-horizontal-group-item, .pi-data-value, .pi-font, .pi-border-color, .pi-item-spacing").last()).html();

                rawRefineElement = rawRefineElement.replace(/<\/?a(?:(?= )[^>]*)?>/gi, "")

                refine[refineIndex] = turndown.turndown(rawRefineElement);
                refineIndex++;
            });

            let thumbnailSrcElement = $(".pi-image-thumbnail").first();
            let thumbnailSrc = thumbnailSrcElement.attr('src');

            // if (!materialImageSrc || materialImageSrc.length <= 0) materialImageSrc = materialImage.attr('src');


            return {
                name,
                type,
                rarity,
                attribute,
                loreText,
                refine,
                thumbnail: this.transformRawUrl(thumbnailSrc),
            }
        } catch (e) {
            console.log(`Error occurred while fetching ${path}`, e);
        }
    }

    async loadToDatabase(data, ignoreWeaponExistence = false) {
        const slug = data.name.toLowerCase().replace(/ /g, "-");
        const weapon = database.collection("weapons").doc(slug);
        const exist = (await weapon.get()).exists;

        if (!ignoreWeaponExistence && exist) return;

        const iconFileName = Scraper.EXTERNAL_FILE_REGEX.exec(data.thumbnail).groups.filename.replace("Weapon_", "");
        await this.saveImageToStorage(data.thumbnail, `icons/weapons/${iconFileName}`);

        data = {
            ...data,
            canonical: slug,
            thumbnail: `icons/weapons/${iconFileName}`,
            link: `/weapon/${slug}`
        }

        if (!exist) {
            await weapon.set({
                ...data
            })
        } else {
            await weapon.update({
                ...data
            })
        }
    }
}
