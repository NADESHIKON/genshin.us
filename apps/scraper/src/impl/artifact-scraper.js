import Scraper from '../scraper';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
const database = admin.firestore();

const BASE_DOMAIN = "https://genshin-impact.fandom.com";
const ARTIFACT_URL = `${BASE_DOMAIN}/wiki/Artifacts/Sets`;

const MAPPING_PIECE_TYPE = {
    'Flower of Life': 'FLOWER',
    'Plume of Death': 'FEATHER',
    'Sands of Eon': 'SANDS',
    'Goblet of Eonothem': 'GOBLET',
    'Circlet of Logos': 'CIRCLET'
}

const MAPPING_BONUS_TYPE = {
    '2-Piece Bonus': 'TWO_PIECE',
    '4-Piece Bonus': 'FOUR_PIECE',
    '1-Piece Bonus': 'ONE_PIECE'
}

import TurndownService from "turndown";

const turndown = new TurndownService();

export default class ArtifactScraper extends Scraper {
    async preload() {
        const response = await (await fetch(ARTIFACT_URL)).text();
        const $ = cheerio.load(response);

        return Array.from($(".wikitable, .sortable, .tdc2, .tdc3, .jquery-tablesorter").first().children("tbody").first().children("tr")).map(e => {
            let elements = $(e).find("td");
            let linkElement = elements.first().find("a").first();
            let name = linkElement.attr('title');
            let link = linkElement.attr('href');
            let rarityRaw = $(elements[1]).text().replace('★', '').split("-")
            let rarity = {
                min: Number.parseInt(rarityRaw[0]),
                max: rarityRaw.length > 1 ? Number.parseInt(rarityRaw[1]) : Number.parseInt(rarityRaw[0])
            }

            return {
                name,
                link,
                rarity
            }
        }).filter(e => !!e.name);
    }

    async scrape(path) {
        if (path.link === '/wiki/Initiate') return;

        try {
            const response = await (await fetch(`${BASE_DOMAIN}${path.link}`)).text();
            const $ = cheerio.load(response);

            let informationTable = $(".pi-item, .pi-data, .pi-item-spacing, .pi-border-color").children("h3, div .pi-data-label, .pi-data-value")

            let pieceCount = informationTable.find("img").length;

            let pieces = [], bonuses = {};

            if (pieceCount === 5) {
                for (let i = 0; i < 10; i += 2) {
                    let thumbnail = $(informationTable[i]).find('a').first().attr('href');
                    let piece = $(informationTable[i + 1]);

                    let pieceType = MAPPING_PIECE_TYPE[piece.find('b').first().text().trim()];

                    piece.find('br, b').remove();

                    let pieceName = piece.text();

                    pieces.push({
                        type: pieceType,
                        name: pieceName,
                        icon: this.transformRawUrl(thumbnail)
                    })
                }

                for (let i = 10; i < 14; i += 2) {
                    let type = MAPPING_BONUS_TYPE[$(informationTable[i]).text()];
                    let piece = $(informationTable[i + 1]);

                    let effect = piece.html();
                    effect = turndown.turndown(effect.replace(/<\/?(?!b)(?!li)(?!ul)\w*\b[^>]*>/ig, "")).replace(/\n[*][*]/g, "\n\n**").replace(/:[*][*]/g, "**\n").replace(/\n\n\n/g, "\n\n");

                    bonuses[type] = {
                        type: type,
                        effect: effect
                    }
                }
            } else if (pieceCount === 1) {
                let thumbnail = $(informationTable[0]).find('img').first().attr('src');
                let piece = $(informationTable[1]);

                let pieceType = MAPPING_PIECE_TYPE[piece.find('b').first().text().trim()];

                piece.find('br, b').remove();

                let pieceName = piece.text();

                pieces.push({
                    type: pieceType,
                    name: pieceName,
                    icon: this.transformRawUrl(thumbnail)
                });

                let bonusType = MAPPING_BONUS_TYPE[$(informationTable[2]).text()];
                let bonusEffect = $(informationTable[3]);

                let effect = bonusEffect.html();
                effect = turndown.turndown(effect.replace(/<\/?(?!b)(?!li)(?!ul)\w*\b[^>]*>/ig, "")).replace(/\n[*][*]/g, "\n\n**").replace(/:[*][*]/g, "**\n").replace(/\n\n\n/g, "\n\n");

                bonuses[bonusType] = {
                    type: bonusType,
                    effect: effect
                }
            }

            return {
                name: path.name,
                rarity: path.rarity,
                pieces: pieces,
                bonuses: bonuses
            }
        } catch (e) {
            console.log(`Error occurred while fetching ${path}`, e);
        }
    }

    async loadToDatabase(data, ignoreArtifactExistence = false) {
        const slug = data.name.toLowerCase().replace(/ /g, "-");
        const artifact = database.collection("artifacts").doc(slug);
        const exist = (await artifact.get()).exists;

        if (!ignoreArtifactExistence && exist) return;

        let pieces = [];

        for (let piece of data.pieces) {
            try {
                const iconFileName = Scraper.EXTERNAL_FILE_REGEX.exec(piece.icon).groups.filename.replace("Item_", "");
                await this.saveImageToStorage(piece.icon, `icons/artifacts/${iconFileName}`);
                pieces.push({
                    ...piece,
                    icon: `icons/artifacts/${iconFileName}`
                })
            } catch (e) {
                console.log(`Error occurred while parsing file name for ${piece.icon} at ${data.name}`, e);
            }
        }

        data = {
            ...data,
            canonical: slug,
            pieces: pieces,
            thumbnail: pieces[0].icon,
            link: `/artifact/${slug}`
        }

        if (!exist) {
            await artifact.set({
                ...data
            })
        } else {
            await artifact.update({
                ...data
            })
        }
    }
}
