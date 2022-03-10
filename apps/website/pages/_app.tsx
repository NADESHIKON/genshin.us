import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../component/layout';

import '../styles/globals.css';
import { Providers } from '@/component/providers';
import PageContainer from '@/component/container/page';
import { Partytown } from '@builder.io/partytown/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageview } from '@/lib/analytic/gtag';

export default function WebsiteApp(props: AppProps) {
    const { Component, pageProps } = props;

    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            pageview(url)
        }
        router.events.on("routeChangeComplete", handleRouteChange)
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange)
        }
    }, [router.events]);

    return (
        <>
            <Head>
                <title>GENSHIN.US</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <Partytown debug={process.env.NEXT_PUBLIC_ENVIRONMENT === "Development"} forward={["dataLayer.push"]} />
            </Head>

            <Providers>
                <Layout>
                    <PageContainer>
                        <Component {...pageProps} />
                    </PageContainer>
                </Layout>
            </Providers>
        </>
    );
}