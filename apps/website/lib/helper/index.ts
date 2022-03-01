export const getImageLoader = (src) => {
    if (typeof src === "object") src = src.src;

    return `https://asset.genshin.us/${src}`;
}

export const transformName = (name) => {
    let split = name.split(' ');
    if (name.length > 12 && split.length > 1) name = split[split.length - 1];

    return name;
}

const COLORS = {
    ELECTRO: "#BE64FF"
}

export const getHighlightColor = (element) => COLORS[element.toUpperCase()];