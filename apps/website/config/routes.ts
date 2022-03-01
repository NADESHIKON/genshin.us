import { extendSeo } from "@/config/seo";

const routes = {
    overview: {
        label: "Overview",
        path: "/",
        seo: extendSeo({
            title: "Overview",
            url: ""
        })
    },
    characters: {
        label: "Characters",
        path: "/characters",
        seo: extendSeo({
            title: "Characters",
            url: "characters"
        })
    },
    weapons: {
        label: "Weapons",
        path: "/weapons",
        seo: extendSeo({
            title: "Weapons",
            url: "weapons"
        })
    },
    map: {
        label: "Map",
        path: "/map",
        seo: extendSeo({
            title: "Map",
            url: "map"
        })
    },
    changelog: {
        label: "Changelog",
        path: "/changelog",
        seo: extendSeo({
            title: "Changelog",
            url: "changelog"
        })
    }
}

export default routes;