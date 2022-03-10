import { Badge, Text, useTheme } from '@geist-ui/core';
import NextImage from 'next/image';
import { getImageLoader } from '@/lib/helper';
import Markdown from '@/component/markdown';

export default function WeaponNoteComponent({ weapon }) {
    const theme = useTheme();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row space-x-2">
                        <div className="border-2 rounded-md" style={{ borderColor: theme.palette.accents_2 }}>
                            <NextImage  width="100%" height="100%" loader={getImageLoader} src={weapon.thumbnail}/>
                        </div>
                        <Text b h3 className="py-2">{weapon.name}</Text>
                    </div>
                </div>
            </div>
        </div>
    )
}