import { API_URL } from '@/lib/url';
import fetch from '@/lib/fetch';
import { Card, Divider, Grid, Image, Spacer, Text, Tooltip } from '@geist-ui/core';
import { getImageLoader } from '@/lib/helper';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import timeZone from 'dayjs/plugin/timezone';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import routes from '@/config/routes';
import NextLink from 'next/link';
import CharacterPreview from "@/component/container/character/character-preview";

export default function Website(props) {
    dayjs.extend(relativeTime);
    dayjs.extend(updateLocale);
    dayjs.extend(timeZone);

    dayjs.tz.setDefault("America/Toronto");

    dayjs.updateLocale('en', {
        relativeTime: {
            future: "In %s",
            past: "%s Ago",
            s: 'A Few Seconds',
            m: "A Minute",
            mm: "%d Minutes",
            h: "An Hour",
            hh: "%d Hours",
            d: "A Day",
            dd: "%d Days",
            M: "A Month",
            MM: "%d Months",
            y: "A Year",
            yy: "%d Years"
        }
    });

    const calculateTimeLeft = time => dayjs(time).fromNow(true);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(props.banners.character.time.to));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(props.banners.character.time.to));
        }, 1000);

        return clearTimeout(timer);
    });

    const { character, weapon } = props.banners;

    return (
        <>
            <Head>
                <title>{routes.overview.label}</title>
            </Head>
            <Tooltip text={`Ends in ${timeLeft}`}>
                <Text font="1.5rem" className="select-none cursor-pointer" blockquote my={0}>
                    {dayjs(props.banners.character.time.from).format("MM/DD/YYYY")} - {dayjs(props.banners.character.time.to).format("MM/DD/YYYY")}
                </Text>
            </Tooltip>
            <BannerComponent src={character.information[0]} character/>
            {character.information.length > 1 &&
                <>
                    <Divider/>
                    <BannerComponent src={character.information[1]} character/>
                </>
            }
            <Divider/>
            <BannerComponent src={weapon.information[0]}/>
        </>
    );
}

const BannerComponent = ({ src, character = false }) => {
    return (
        <div className="my-5">
            <Image src={getImageLoader(src.image)}/>
            <Spacer/>
            <Grid.Container gap={1} justify="center">
                {src.promotional.map(entry => {
                    return (<Grid xs={12} md={6}>
                        {character &&
                            <CharacterPreview character={entry}/>
                        }
                        {!character &&
                            <NextLink href={entry.link}>
                                <Card hoverable className="cursor-pointer">
                                    <Card.Content>
                                        <Image src={getImageLoader(entry.thumbnail)} draggable={false}/>
                                    </Card.Content>
                                </Card>
                            </NextLink>
                        }
                    </Grid>)
                })}
            </Grid.Container>
        </div>
    )
}
export async function getStaticProps({ params }) {
    const response = await (await fetch(`${API_URL}/banners`)).json();

    // @ts-ignore
    let characters = response.character.information;
    // @ts-ignore
    let weapons = response.weapon.information;

    for (let character of characters) {
        let promotional = [];

        for (let promo of character.promotional) {
            promotional.push(await (await fetch(`${API_URL}/character/${promo.toLowerCase().replace(/ /g, "-")}`)).json());
        }

        character.promotional = promotional;
    }

    for (let weapon of weapons) {
        let promotional = [];

        for (let promo of weapon.promotional) {
            promotional.push(await (await fetch(`${API_URL}/weapon/${promo.toLowerCase().replace(/ /g, "-")}`)).json());
        }

        weapon.promotional = promotional;
    }

    return {
        props: {
            banners: {
                character: {
                    // @ts-ignore
                    ...response.character,
                    information: characters
                },
                weapon: {
                    // @ts-ignore
                    ...response.weapon,
                    information: weapons
                }
            }
        },
        revalidate: 60 * 60 * 24
    }
}