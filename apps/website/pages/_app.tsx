import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from "../component/layout";

import '../styles/globals.css';
import { Providers } from "@/component/providers";
import PageContainer from "@/component/container/page";

export default function WebsiteApp(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
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