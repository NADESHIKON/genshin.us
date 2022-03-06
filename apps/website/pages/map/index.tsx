import routes from "@/config/routes";
import Head from "next/head";
import { NextSeo } from "next-seo";

export default function Map(props) {
    return (
        <>
            <Head>
                <title>{routes.map.label}</title>
            </Head>
            <NextSeo
                {...routes.map.seo}
            />
            <div className="h-screen w-full content-center justify-self-center items-center justify-items-center">
                <iframe className="h-full w-full justify-self-center rounded-md" src="https://webstatic-sea.mihoyo.com/?lang=en-us#/map/2?shown_types="/>
            </div>
        </>
    )
}