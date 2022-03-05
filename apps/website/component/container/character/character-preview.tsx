import { Card, Image, Text, useTheme } from "@geist-ui/core";
import { getImageLoader, transformName } from "@/lib/helper";
import NextLink from "next/link";

export default function CharacterPreview({ character }) {
    const theme = useTheme();

    return (
        <NextLink href={character.link}>
            <Card hoverable className="cursor-pointer">
                <Card.Content>
                    <div>
                        <div className="z-10 absolute w-10 h-10 rounded-full p-1" style={{
                            backgroundColor: theme.palette.accents_1
                        }}>
                            <img className="z-10 left-0 top-0" src={getImageLoader(`icons/elements/${character.element.substring(0, 1).toUpperCase() + character.element.substring(1).toLowerCase()}.png`)}/>
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
    )
}