export const getImageLoader = (src) => {
    if (typeof src === "object") src = src.src;

    return `https://asset.genshin.us/${src}`;
}

export const transformName = (name) => {
    let split = name.split(' ');
    if (name.length > 12 && split.length > 1) name = split[split.length - 1];

    return name;
}

const ELEMENT_TO_HEX = {
    ANEMO: "#4ffdb3",
    PYRO: "#ff554d",
    ELECTRO: "#BE64FF",
    DENDRO: "#60bf18",
    HYDRO: "#2471ff",
    GEO: "#ffd064",
    CRYO: "#8ff5fe",
    ADAPTIVE: "#808080"
}

export const getHighlightColor = (element) => ELEMENT_TO_HEX[element.toUpperCase()];

const RESERVED = [
    "DMG",
    "ATK",
    "DEF",
    "HP",
    "ATK%"
]

export const capitalize = (word) => word.split("_").map(w => w.charAt(0).toUpperCase() + (RESERVED.includes(w) ? w.slice(1) : w.slice(1).toLowerCase())).join(" ");
