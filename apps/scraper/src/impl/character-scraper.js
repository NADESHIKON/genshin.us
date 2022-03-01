import Scraper from "../scraper";
import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
const database = admin.firestore();
import * as cheerio from 'cheerio';

import TurndownService from "turndown";

const turndown = new TurndownService();

import fetch from "node-fetch";

const BASE_DOMAIN = "https://genshin-impact.fandom.com";
const CHARACTER_URL = `${BASE_DOMAIN}/wiki/Characters`;

const TRAVELER_ELEMENTS = ['anemo', 'geo', 'electro', 'unaligned'];

const reserved = [
    "Energy",
    "Crystallize"
];

export default class CharacterScraper extends Scraper {
    async preload(name) {
        const response = await (await fetch(CHARACTER_URL)).text();
        const $ = cheerio.load(response);

        return Array.from($($(".article-table, .sortable")[0]).find("tr")).map(e => $(e).find("td")[0]).filter(e => e !== undefined).map(e => {
            const image = $(e).find("img").first();
            const linkElement = $(e).find("a").first();

            return {
                icon: image.attr('data-src'),
                link: linkElement.attr('href'),
                name: linkElement.attr('title')
            }
        }).filter(e => {
            if (!name) return true;

            return e.name.toLowerCase().replace(/_/g, " ") === name.toLowerCase().replace(/_/g, " ");
        });
    }

    async scrape(path) {
        const traveler = path.link === '/wiki/Traveler';

        const response = await (await fetch(`${BASE_DOMAIN}${path.link}`)).text();
        const $ = cheerio.load(response);

        const name = $($(".page-header__title")[0]).text().trim();
        const portraitElement = $($(".pi-image-thumbnail")[0]);
        let portrait = portraitElement.attr("data-src");
        if (!portrait || portrait.length <= 0) portrait = portraitElement.attr("src");

        const informationTable = $(".pi-data-value, .pi-font");

        const extraInformationTable = Array.from($(".pi-item, .pi-panel, .pi-border-color, .wds-tabber"));
        const observeProperty = [
            //'sex',
            'constellation',
        ]

        const information = {};

        for (let info of extraInformationTable) {
            let element = $(info);
            let dataSource = element.attr('data-source');

            if (observeProperty.includes(dataSource)) {
                let value = element.children('.pi-data-value, .pi-font').first().text().trim();
                if (dataSource === 'sex') {
                    dataSource = 'gender';
                }

                if (value === 'Viator (Male)Viatrix (Female)') value = 'Viator / Viatrix'

                information[dataSource] = value;
            }
        }

        // if (information['gender']) information['gender'] = information['gender'] === "Player's Choice" ? 2 : information['gender'] === "Male" ? 0 : 1;
        if (information['constellation']) information['constellation'] = information['constellation'].replace("Story Quest Chapter", "").trim();

        const { constellation } = information;

        const rarity = Number.parseInt($($(informationTable[0]).find("img")[0]).attr("alt").replace(/ Stars/g, ""));
        const weapon = $($(informationTable[1]).find("a")[0]).attr("title").toUpperCase();

        const element = $(informationTable[2]).text().replace(/ /g, "").toUpperCase();
        const titles = Array.from($(".wds-tab__content > .pi-data-value, .pi-font > ul > li")).map(e => $(e).text().replace(/\[\d\]/, "").replace(/(\(|\))/g, "").replace(/by [A-Za-z0-9]*/g, "").trimEnd()).reduce((a, b) => a.concat(b), []);

        const description = $($("p")[2]).text().replace(/\n$/, '');

        const tables = $(".wikitable");

        let talentsElement, constellationsElement;
        let talents = [], constellations = {}, talent_materials = [];

        if (traveler) {
            let index = 0;
            talents = {};

            for (let ele of TRAVELER_ELEMENTS) {
                talentsElement = $($($(".talent_table")[index]).find("tbody")[0]).children("tr");
                talents[ele] = this.parseTalents($, talentsElement);

                if (ele !== 'unaligned') {
                    constellationsElement = $($(".tdc1")[index]).find("tr");
                    constellations[ele] = this.parseConstellations($, constellationsElement);
                }
                index++;
            }

            talent_materials = {};

            let totalCost = $("b:contains(Total Cost)"); //.last().parent();

            // let currentMaterials = [];

            /*
            for (let i = 1; i < totalCost.length - 1; i++) {
                let materialElement = $(totalCost[i]).parent();
                if (i % 2 === 0) {
                    for (let e of TRAVELER_ELEMENTS.splice(0, TRAVELER_ELEMENTS.length - 1)) {
                        if (!talent_materials[e]) talent_materials[e] = currentMaterials;
                    }

                    currentMaterials = [];
                }

                currentMaterials.push(this.parseTalentMaterials($, materialElement));
            }
             */

            talent_materials['anemo'] = this.parseTalentMaterials($, $(totalCost[1]));
            talent_materials['geo'] = this.parseTalentMaterials($, $(totalCost[3]));
            talent_materials['electro'] = this.parseTalentMaterials($, $(totalCost[4]));
            let unalignedTotalCost = $(totalCost[totalCost.length - 1]);
            talent_materials['unaligned'] = this.parseTalentMaterials($, unalignedTotalCost);
        } else {
            talentsElement = $($($(".talent_table")[0]).find("tbody")[0]).children("tr");
            talents = this.parseTalents($, talentsElement);

            constellationsElement = $($(".tdc1")[0]).find("tr");
            constellations = this.parseConstellations($, constellationsElement);

            let totalCost = $("b:contains(Total Cost)").last().parent();
            talent_materials = this.parseTalentMaterials($, totalCost);
        }

        const attribute = $($(tables[0]).find("tr").first().find("th")[5]).text().replace("\n", "").replace(/ /g, "_").toUpperCase().replace(/[\(\)]/g, "").replace("SPECIAL_STAT", "").replace(/[^a-z_]/gmi, " ").trim();

        return {
            name,
            // gender,
            portrait,
            rarity,
            weapon,
            constellation,
            element,
            titles,
            description,
            attribute,
            talents,
            constellations,
            thumbnail: this.transformRawUrl(path.icon),
            talent_materials,
            multiple_elements: traveler
        }
    }

    parseTalentMaterials($, materialElement) {
        // let totalCost = $("b:contains(Total Cost)").last().parent();

        let dummy = materialElement.next();

        const talent_materials = [];

        while (dummy && dummy.prop('tagName').toUpperCase() !== 'H3') {
            let linkElement = $(dummy).children('.card_image').first().children('a');
            let materialTitle = linkElement.attr('title');
            let materialImage = $(linkElement).children('img');
            let materialImageSrc = materialImage.attr('data-src');
            if (!materialImageSrc || materialImageSrc.length <= 0) materialImageSrc = materialImage.attr('src');

            talent_materials.push({
                title: materialTitle,
                image: this.transformRawUrl(materialImageSrc)
            });

            dummy = dummy.next();
            if (dummy.attr('class') === 'mobileHide') dummy = dummy.next();

            // console.log(dummy.html())
        }

        return talent_materials;
    }

    parseTalents($, talentsElement) {
        const talents = [];

        $(talentsElement).find('.mw-collapsible').remove();

        for (let i = 1; i < talentsElement.length - 1; i += 2) {
            const main = $(talentsElement[i]), sub = $(talentsElement[i + 1]);
            const name = $(main.find("td")[1]).text().replace(/[\n\r]/g, "").replace(/\(.*\)/g, "").trimEnd();

            if (name.trimEnd() === "Default Sprint") continue;

            let iconElement = $(main.find("td")[0]).find("img").first();
            let icon = iconElement.attr("data-src");
            if (!icon || icon.length <= 0) icon = iconElement.attr("src");

            // icon = icon.dataset ? icon.dataset.src : icon.src;

            let type = $(main.find("td")[2]).text().replace(/[\n\r]/g, "");
            if (type.includes("Passive")) type = "PASSIVE";
            else type = type.replace(/ /g, "_").toUpperCase();

            let description = turndown.turndown(sub.html().replace(/<\/?(?!b)(?!li)(?!ul)\w*\b[^>]*>/ig, "")).replace(/\n[*][*]/g, "\n**").replace(/:[*][*]/g, "**\n").replace(/\n\n\n/g, "\n");

            for (const reservedWord of reserved) {
                description = description.replace(new RegExp(`[*][*]${reservedWord}[*][*]`, "ig"), reservedWord);
            }

            talents.push({
                image: this.transformRawUrl(icon),
                info: description,
                name: (type === "NORMAL_ATTACK" ? "Normal Attack: " : "") + name,
                type: type
            })
        }

        return talents;
    }

    parseConstellations($, constellationsElement) {
        const constellations = {};

        for (let i = 1; i < constellationsElement.length; i++) {
            const main = $(constellationsElement[i]);
            const name = $(main.find("td")[2]).text().replace(/[\n\r]/g, "").replace(/\(.*\)/g, "").trimEnd();

            let iconElement = $(main.find("td")[1]).find("img").first();
            let icon = iconElement.attr("data-src");
            if (!icon || icon.length <= 0) icon = iconElement.attr("src");

            // icon = icon.dataset ? icon.dataset.src : icon.src;

            let effect = turndown.turndown($(main.find("td")[3]).html().replace(/<a[^>]*>/g,"<b>").replace(/<\/a>/g,"</b>").replace(/<\/?(?!b)(?!li)(?!ul)\w*\b[^>]*>/ig, "")).replace(/\n\n\n/g, "\n");

            for (const reservedWord of reserved) {
                effect = effect.replace(new RegExp(`[*][*]${reservedWord}[*][*]`, "ig"), reservedWord);
            }

            constellations["c" + i] = {
                image: this.transformRawUrl(icon),
                effect: effect,
                name: name,
            }
        }

        return constellations;
    }

    async loadToDatabase(data, ignoreCharacterExistence = false) {
        const { multiple_elements } = data;

        const slug = data.name.toLowerCase().replace(/ /g, "-");
        const character = database.collection("characters").doc(slug);
        const exist = (await character.get()).exists;

        if (!ignoreCharacterExistence && exist) return;

        const iconFileName = Scraper.EXTERNAL_FILE_REGEX.exec(data.thumbnail).groups.filename.replace("Character_", "");
        await this.saveImageToStorage(data.thumbnail, `icons/characters/${iconFileName}`);

        const cardFileName = Scraper.EXTERNAL_FILE_REGEX.exec(data.portrait).groups.filename.replace("Character_", "");
        await this.saveImageToStorage(data.portrait, `portraits/characters/${cardFileName}`);

        let talentsDocument, talents, constellationsDocument, constellations, talent_materials;
        if (multiple_elements) {
            talentsDocument = {};

            for (const element in data.talents) {
                let talentDocument = database.collection("talents").doc(slug + "-" + element);

                talents = await Promise.all(data.talents[element].map(async talent => {
                    const talentFileName = decodeURIComponent(Scraper.EXTERNAL_FILE_REGEX.exec(talent.image).groups.filename.replace("Talent_", ""));

                    await this.saveImageToStorage(talent.image, `icons/talents/${talentFileName}`);
                    return {
                        ...talent,
                        image: `icons/talents/${talentFileName}`
                    }
                }));

                if (!exist) {
                    await talentDocument.set({
                        ...talents
                    });
                } else {
                    await talentDocument.update({
                        ...talents
                    });
                }

                talentsDocument[element] = talentDocument;
            }

            constellationsDocument = {}; // database.collection("constellations").doc(slug);

            for (const constellationElement in data.constellations) {
                let constellationDocument = database.collection("constellations").doc(slug + "-" + constellationElement);

                const constellations = data.constellations[constellationElement];

                for (const constellationKey in constellations) {
                    const constellation = constellations[constellationKey];

                    const constellationFileName = Scraper.EXTERNAL_FILE_REGEX.exec(constellation.image).groups.filename.replace("Constellation_", "");

                    await this.saveImageToStorage(constellation.image, `icons/constellations/${constellationFileName}`);

                    constellations[constellationKey] = {
                        ...constellation,
                        image: `icons/constellations/${constellationFileName}`
                    }
                }

                if (!exist) {
                    await constellationDocument.set({
                        ...constellations
                    });
                } else {
                    await constellationDocument.update({
                        ...constellations
                    });
                }

                constellationsDocument[constellationElement] = constellationDocument;
            }

            talent_materials = {};
            const talentMaterials = data.talent_materials;
            for (let materialElement in talentMaterials) {
                let talentMaterialsElement = [];

                for (let talentMaterial of talentMaterials[materialElement]) {
                    if (!talentMaterial.title || talentMaterial.title === 'Mora' || talentMaterial.title === 'Crown of Insight') continue;

                    let materialFileName = Scraper.EXTERNAL_FILE_REGEX.exec(talentMaterial.image).groups.filename.replace("Item_", "");

                    await this.saveImageToStorage(talentMaterial.image, `icons/material/${materialFileName}`);

                    talentMaterialsElement.push({
                        title: talentMaterial.title,
                        icon: `icons/material/${materialFileName}`
                    });
                }

                talent_materials[materialElement] = talentMaterialsElement;
            }
        } else {
           talentsDocument = database.collection("talents").doc(slug);

           talents = await Promise.all(data.talents.map(async talent => {
                const talentFileName = decodeURIComponent(Scraper.EXTERNAL_FILE_REGEX.exec(talent.image).groups.filename.replace("Talent_", ""));

                await this.saveImageToStorage(talent.image, `icons/talents/${talentFileName}`);
                return {
                    ...talent,
                    image: `icons/talents/${talentFileName}`
                }
           }));

            if (!exist) {
                await talentsDocument.set({
                    ...talents
                });
            } else {
                await talentsDocument.update({
                    ...talents
                });
            }

            constellationsDocument = database.collection("constellations").doc(slug);
            constellations = data.constellations;

            for (const constellationKey in constellations) {
                const constellation = data.constellations[constellationKey];
                const constellationFileName = Scraper.EXTERNAL_FILE_REGEX.exec(constellation.image).groups.filename.replace("Constellation_", "");

                await this.saveImageToStorage(constellation.image, `icons/constellations/${constellationFileName}`);

                constellations[constellationKey] = {
                    ...constellation,
                    image: `icons/constellations/${constellationFileName}`
                }
            }

            if (!exist) {
                await constellationsDocument.set({
                    ...constellations
                });
            } else {
                await constellationsDocument.update({
                    ...constellations
                });
            }

            talent_materials = [];
            const talentMaterials = data.talent_materials;
            for (let talentMaterial of talentMaterials) {
                if (!talentMaterial.title || talentMaterial.title === 'Mora' || talentMaterial.title === 'Crown of Insight') continue;

                let materialFileName = Scraper.EXTERNAL_FILE_REGEX.exec(talentMaterial.image).groups.filename.replace("Item_", "");

                await this.saveImageToStorage(talentMaterial.image, `icons/material/${materialFileName}`);

                talent_materials.push({
                    title: talentMaterial.title,
                    icon: `icons/material/${materialFileName}`
                });
            }
        }

        data = {
            ...data,
            canonical: slug,
            portrait: `portraits/characters/${cardFileName}`,
            thumbnail: `icons/characters/${iconFileName}`,
            talent_materials: talent_materials,
            talents: talentsDocument,
            constellations: constellationsDocument,
            link: `/character/${slug}`
        }

        if (!exist) {
            await character.set({
                ...data
            });
        } else {
            await character.update({
                ...data
            });
        }
    }
}
