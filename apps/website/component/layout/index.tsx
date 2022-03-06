import Header from '@/component/navigation/header';
import NextNProgress from 'nextjs-progressbar';
import Footer from "@/component/navigation/footer";
import { DefaultSeo } from 'next-seo';
import { useRouter } from "next/router";
import { baseUrl, defaultSeo } from "@/config/seo";

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <>
            <DefaultSeo
                {...defaultSeo}
                openGraph={{
                    type: "website",
                    locale: "en_US",
                    url: `${baseUrl}${router.asPath}`,
                    site_name: "GENSHIN.US",
                }}
            />
            <NextNProgress
                color="#FFF"
            />
            <Header/>
            {children}
            <Footer/>
        </>
    )
}