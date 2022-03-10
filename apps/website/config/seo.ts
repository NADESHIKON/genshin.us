const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.ENVIRONMENT;

export const baseUrl =
    environment === "Production" ? "https://genshin.us" : environment === "Development" ? "https://dev.genshin.us" : "";

export const defaultSeo = {
    title: "Genshin.US - User-Friendly Genshin Impact Fan Database",
    description: "An independent fan-made ad-free Genshin Impact database of Teyvat's characters and their skills, talents, and builds.",
    openGraph: {
        site_name: "Genshin.US - Genshin Impact Fan Database",
        images: [{
            url: "/logo-og.png",
            alt: "PaiTao"
        }],
        type: "website",
        locale: "en_US"
    },
    additionalMetaTags: [
        {
            property: "keywords",
            content: "Genshin, Genshin Impact, Fan, Database, Characters, Builds, Spiral Abyss, News, Events, Information"
        },
        {
            property: "publisher",
            content: "Genshin.US Development Team"
        },
        {
            property: "theme-color",
            content: "#1D1F20"
        }
    ],
    additionalLinkTags: [
        {
            rel: "icon",
            href: "/favicon.ico"
        }
    ]
}

interface SEOProps {
    title?: string
    description?: string
    image?: string
    url?: string
}

export const extendSeo = (options: SEOProps) => {
    const images = options.image
        ? [{ url: `${baseUrl}/static/${options.image}` }]
        : defaultSeo.openGraph.images

    return {
        ...defaultSeo,
        ...options,
        url: `${baseUrl}/${options.url}`,
        openGraph: {
            ...defaultSeo.openGraph,
            images,
            url: `${baseUrl}/${options.url}`,
        },
    }
}