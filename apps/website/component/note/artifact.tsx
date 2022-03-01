import { Badge, Text, useTheme } from '@geist-ui/core';
import NextImage from 'next/image';
import { getImageLoader } from '@/lib/helper';
import Markdown from '@/component/markdown';

export default function ArtifactNoteComponent({ artifact, single= false }) {
    const theme = useTheme();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row space-x-2">
                        <Badge.Anchor placement="bottomRight">
                            <Badge style={{
                                backgroundColor: theme.palette.background,
                                color: theme.palette.foreground
                            }} scale={1.0}>{single ? 4 : 2}</Badge>
                            <div className="border-2 rounded-md" style={{ borderColor: theme.palette.accents_2 }}>
                                <NextImage  width="100%" height="100%" loader={getImageLoader} src={artifact.thumbnail}/>
                            </div>
                        </Badge.Anchor>
                        <Text b h3 className="py-2">{artifact.name}</Text>
                    </div>
                    <Text blockquote className="w-full">
                        <div className="flex flex-row space-x-2">
                            <p className="text-center my-0">(2)</p>
                            <Markdown my={0} text={artifact.bonuses.TWO_PIECE.effect}/>
                        </div>
                        {single &&
                            <>
                                <br/>
                                <div className="flex flex-row space-x-2">
                                    <p className="text-center my-0">(4)</p>
                                    <Markdown my={0} text={artifact.bonuses.FOUR_PIECE.effect}/>
                                </div>
                            </>
                        }
                    </Text>
                </div>
            </div>
        </div>
    )
}