import { API_URL } from '@/lib/url';
import {
    Badge,
    Breadcrumbs,
    Card,
    Divider,
    Drawer,
    Image,
    Rating,
    Spacer,
    Table,
    Tag,
    Text, Tooltip,
    useTheme
} from '@geist-ui/core';
import { getHighlightColor, getImageLoader } from '@/lib/helper';
import Star from '@/component/icon/star';
import NextLink from 'next/link';
import Head from 'next/head';
import { useState } from "react";
import Markdown from '@/component/markdown';
import NextImage from 'next/image';
import ArtifactNoteComponent from "@/component/note/artifact";
import WeaponnoteComponent from "@/component/note/weapon";
import { CheckInCircle } from "@geist-ui/icons";

export default function Character(props) {
    const theme = useTheme();

    const [navigation, setNavigation] = useState(false);

    const constellationInformation = props.constellations.map(constellation => {
        return {
            ...constellation,
            name: <Text style={{ color: theme.palette.accents_7 }}>{constellation.name}</Text>,
            effect: <Markdown text={constellation.effect} highlightColor={getHighlightColor(props.element)}/>,
            image: <Image draggable={false} width="36px" height="36px" src={getImageLoader(constellation.image)}/>
        }
    });

    const talentInformation = props.talents.map(talent => {
        return {
            ...talent,
            name: <Text style={{ color: theme.palette.accents_7 }}>{talent.name}</Text>,
            info: <Markdown text={talent.info} highlightColor={getHighlightColor(props.element)}/>,
            image: <Image draggable={false} width="36px" height="36px" src={getImageLoader(talent.image)}/>
        }
    });

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Head>
                <title>{props.name}'s Information and Builds</title>
            </Head>
            <Drawer visible={navigation}/>
            <div className="flex flex-col space-y-5">
                <Breadcrumbs className="select-none">
                    <NextLink href="/characters">
                        <Breadcrumbs.Item style={{
                            color: theme.palette.accents_4
                        }} nextLink>Characters</Breadcrumbs.Item>
                    </NextLink>
                    <Breadcrumbs.Item style={{ color: theme.palette.foreground }}>{props.name}</Breadcrumbs.Item>
                </Breadcrumbs>

                <div className="flex flex-row space-x-0 lg:space-x-8">
                    <div className="rounded-md hidden lg:block lg:w-1/4">
                        <NextImage width="512px" height="512px" className="rounded-md hidden lg:block w-1/4" loader={getImageLoader} src={props.thumbnail}/>
                    </div>
                    <div className="flex flex-col select-none lg:w-3/4">
                        <div className="flex flex-row lg:space-x-5 space-between">
                            <div className="block lg:hidden w-1/4">
                                <NextImage width="128px" height="128px" className="rounded-md w-1/4" loader={getImageLoader} src={props.thumbnail}/>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:space-x-5 w-3/4">
                                <Text h1>
                                    {props.name}
                                </Text>
                                <div className="flex flex-row items-center">
                                    {[...Array(props.rarity)].map(_ => {
                                        return (<Star/>)
                                    })}
                                </div>
                            </div>
                        </div>
                        <Spacer/>
                        <Text blockquote my={0}>
                            {props.description}
                        </Text>
                    </div>
                </div>

                <div className="flex flex-col">
                    <Text h2>Talent</Text>
                    <Table data={talentInformation}>
                        <Table.Column prop="image" label="Icon" width={36}/>
                        <Table.Column prop="name" label="Name" width={50}/>
                        <Table.Column prop="info" label="Description" width={700}/>
                    </Table>
                </div>

                <div className="flex flex-col">
                    <Text h2>Constellation</Text>
                    <Table data={constellationInformation}>
                        <Table.Column prop="image" label="Icon" width={36}/>
                        <Table.Column prop="name" label="Name" width={50}/>
                        <Table.Column prop="effect" label="Description" width={700}/>
                    </Table>
                </div>

                <Text h2>Builds</Text>
                <div className="flex flex-col">
                    {Object.values(props.notes).filter(note => {
                        // @ts-ignore
                        return !!note.artifactCombination && !!note.weaponCombination;
                    }).map(note => {
                        // @ts-ignore
                        const { artifactCombination, weaponCombination, title, description } = note;

                        return (
                            <>
                                <Text h3>{title}</Text>
                                <div>
                                    <Text blockquote className="my-0">
                                        {description}
                                    </Text>
                                </div>
                                <div className="flex flex-row space-x-5 w-full">
                                    <div className="flex flex-col w-1/2">
                                        <Text>Weapons</Text>
                                        {Object.values(weaponCombination).map(combination => {
                                            // @ts-ignore
                                            const { weapons, tags, bis } = combination;

                                            return (
                                                <>
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex flex-row space-x-5 items-center">
                                                            {bis &&
                                                                <Tooltip text={"Best in Slot"}>
                                                                    <CheckInCircle color="#44a842" className="cursor-pointer" size={36}/>
                                                                </Tooltip>
                                                            }
                                                            {tags.map(tag => {
                                                                if (tag.length <= 0) return <></>

                                                                return (
                                                                    <Tag>{tag.replace(/[\[\]]/g, "")}</Tag>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="border-2 p-2 rounded-md">
                                                            {weapons.map(weapon => {
                                                                return (
                                                                    <>
                                                                        <WeaponnoteComponent weapon={weapon}/>
                                                                        {weapons.indexOf(weapon) < weapons.length - 1 &&
                                                                            <Divider h={3} my={3}>OR</Divider>
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <Text>Artifacts</Text>
                                        {Object.values(artifactCombination).map(combination => {
                                            // @ts-ignore
                                            const { artifacts1, artifacts2, tags, bis } = combination;

                                            const single = artifacts1.length <= 0 || artifacts2.length <= 0, singleArtifact = artifacts1.length > 0 ? artifacts1 : artifacts2;

                                            return (
                                                <>
                                                    {single &&
                                                        <>
                                                            <div className="flex flex-col space-y-1">
                                                                <div className="flex flex-row space-x-5 items-center">
                                                                    {bis &&
                                                                        <Tooltip text={"Best in Slot"}>
                                                                            <CheckInCircle color="#44a842" className="cursor-pointer" size={36}/>
                                                                        </Tooltip>
                                                                    }
                                                                    {tags.map(tag => {
                                                                        if (tag.length <= 0) return <></>

                                                                        return (
                                                                            <Tag>{tag.replace(/[\[\]]/g, "")}</Tag>
                                                                        )
                                                                    })}
                                                                </div>
                                                                <div className="border-2 p-2 rounded-md">
                                                                    {singleArtifact.map(artifact => {
                                                                        return (
                                                                            <>
                                                                                <ArtifactNoteComponent single artifact={artifact}/>
                                                                                {singleArtifact.indexOf(artifact) < singleArtifact.length - 1 &&
                                                                                    <Divider h={3} my={3}>OR</Divider>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                    {!single &&
                                                        <>
                                                            <div className="flex flex-col space-y-1">
                                                                <div className="flex flex-row space-x-5 items-center">
                                                                    {bis &&
                                                                        <Tooltip text={"Best in Slot"}>
                                                                            <CheckInCircle color="#44a842" className="cursor-pointer" size={36}/>
                                                                        </Tooltip>
                                                                    }
                                                                    {tags.map(tag => {
                                                                        if (tag.length <= 0) return <></>

                                                                        return (
                                                                            <Tag>{tag.replace(/[\[\]]/g, "")}</Tag>
                                                                        )
                                                                    })}
                                                                </div>
                                                                <div className="border-2 p-2 rounded-md">
                                                                    {artifacts1.map(artifact => {
                                                                        return (
                                                                            <>
                                                                                <ArtifactNoteComponent artifact={artifact}/>
                                                                                {artifacts1.length > 1 && artifacts1.indexOf(artifact) < singleArtifact.length - 1 &&
                                                                                    <Divider h={3} my={3}>OR</Divider>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>
                                                                <Divider h={3} my={3}>AND</Divider>
                                                                <div className="border-2 p-2 rounded-md">
                                                                    {artifacts2.map(artifact => {
                                                                        return (
                                                                            <>
                                                                                <ArtifactNoteComponent artifact={artifact}/>
                                                                                {artifacts2.length > 1 && artifacts2.indexOf(artifact) < singleArtifact.length - 1 &&
                                                                                    <Divider h={3} my={3}>OR</Divider>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                    {Object.values(artifactCombination).indexOf(combination) < Object.values(artifactCombination).length - 1 &&
                                                        <Divider h={3} my={3}>OR</Divider>
                                                    }
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export async function getStaticPaths() {
    let response = await (await fetch(`${API_URL}/character/list`)).json();

    response = response.filter(element => element.canonical !== "traveler");

    const paths = Object.values(response).map((character) => ({
        // @ts-ignore
        params: { name: character.canonical }
    }))

    return { paths, fallback: "blocking" }
}

export async function getStaticProps({ params }) {
    let response = await (await fetch(`${API_URL}/character/${params.name.toLowerCase()}`)).json();

    if (!response.name) return {
        notFound: true
    }

    const notes = response.notes;
    for await (const v of Object.values(notes)) {
        // @ts-ignore
        if (!v.artifactCombination || !v.weaponCombination) continue;

        // @ts-ignore
        for await (const a of Object.values(v.artifactCombination)) {
            // @ts-ignore
            a.artifacts1 = await Promise.all(a.artifacts1.map(async artifact => {
                return await (await fetch(`${API_URL}${artifact}`)).json();
            }));
            // @ts-ignore
            a.artifacts2 = await Promise.all(a.artifacts2.map(async artifact => {
                return await (await fetch(`${API_URL}${artifact}`)).json();
            }));
        }

        // @ts-ignore
        for await (const a of Object.values(v.weaponCombination)) {
            // @ts-ignore
            a.weapons = await Promise.all(a.weapons.map(async weapon => {
                return await (await fetch(`${API_URL}${weapon}`)).json();
            }));
        }
    }

    response.notes = notes;
    return {
        props: response,
        revalidate: 60 * 60 * 5
    }
}