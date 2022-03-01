import fetch from '@/lib/fetch';
import { API_URL } from '@/lib/url';
import { Card, Grid, Image, Input, Text, useInput, useTheme } from '@geist-ui/core';
import { getImageLoader, transformName } from '@/lib/helper';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import routes from '@/config/routes';
import NextLink from 'next/link';

export default function Characters(props) {
    const theme = useTheme();
    const { state, bindings } = useInput("");

    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        if (state.length > 0) setCharacters(props.characters.filter(element => element.name.toLowerCase().startsWith(state.toLowerCase())));
        else setCharacters(props.characters);
    }, [state]);

    return (
        <>
            <Head>
                <title>{routes.characters.label}</title>
            </Head>
            <Input my={2} clearable width="100%" scale={4/3} placeholder="Type here to search for a character.." {...bindings}/>
            <Grid.Container gap={2} justify="center">
                {characters.map(character => {
                    return (
                        <>
                            <Grid key={character.canonical} xs={12} sm={8} md={6} lg={4}>
                                <NextLink href={character.link}>
                                    <Card hoverable className="cursor-pointer">
                                        <Card.Content>
                                            <div>
                                                <div className="z-10 absolute w-10 h-10 rounded-full p-1" style={{
                                                    backgroundColor: theme.palette.accents_1
                                                }}>
                                                    <img className="z-10 right-0 top-0" src={getImageLoader(`icons/elements/${character.element.substring(0, 1).toUpperCase() + character.element.substring(1).toLowerCase()}.png`)}/>
                                                </div>
                                                <Image draggable={false} src={getImageLoader(character.thumbnail)}/>
                                            </div>
                                        </Card.Content>
                                        <Card.Footer py={0} className="items-center content-center justify-center">
                                            <Text className="text-center">
                                                {transformName(character.name)}
                                            </Text>
                                        </Card.Footer>
                                    </Card>
                                </NextLink>
                            </Grid>
                        </>
                    )
                })}
            </Grid.Container>
        </>
    )
}

export async function getStaticProps({ params }) {
    let response = await (await fetch(`${API_URL}/character/list`)).json();

    const baseTraveler = response.find(element => element.canonical === "traveler");

    response = response.filter(element => element.canonical !== "traveler");

    /*
    ["ANEMO", "GEO", "ELECTRO"].forEach(element => {
        response.push({
            ...baseTraveler,
            canonical: `traveler-${element.toLowerCase()}`,
            element: element,
            // name: `Traveler (${element.substring(0, 1).toUpperCase() + element.substring(1).toLowerCase()})`,
            link: `/character/traveler-${element.toLowerCase()}`
        })
    });
     */


    return {
        props: {
            characters: response
        },
        revalidate: 60 * 60 * 12
    }
}
