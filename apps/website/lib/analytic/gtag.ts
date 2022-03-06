export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const optout = () => {
    // @ts-ignore
    window.gtag("consent", "update", {
        "ad_storage": "denied",
        "analytics_storage": "denied"
    });
}

export const pageview = (url) => {
    // @ts-ignore
    window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    })
}

export const event = ({ action, category, label, value }) => {
    // @ts-ignore
    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value
    })
}
