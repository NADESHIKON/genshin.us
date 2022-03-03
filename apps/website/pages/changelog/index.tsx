import routes from "@/config/routes";
import Head from "next/head";
import { API_URL } from "@/lib/url";

export default function Changelog(props) {
    const { logs } = props;

    return (
        <>
            <Head>
                <title>{routes.changelog.label}</title>
            </Head>
            {logs.map(log => {
                if (logs.indexOf(log) === 0) return (
                    <>
                        {log.title}
                    </>
                )

                return <>
                    {log.title}
                </>
            })}
        </>
    )
}

export async function getStaticProps({ params }) {
    let response = await (await fetch(`${API_URL}/changelog`)).json();

    return {
        props: {
            logs: response
        },
        revalidate: 60 * 60 * 5
    }
}