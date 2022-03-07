import { useContext } from 'react';
import { GlobalNavigationContext } from '@/component/providers';
import Menu from "@/component/navigation/menu";
import { useTheme, Text } from '@geist-ui/core';
import { defaultSeo } from '@/config/seo';

export default function Header(props) {
    const theme = useTheme();
    const { open, setOpen } = useContext(GlobalNavigationContext);

    return (
        <>
            <nav className="flex select-none items-center space-between my-0 mx-auto max-w-full" style={{ height: "54px", width: theme.layout.pageWidthWithMargin, padding: theme.layout.pageMargin }}>
                <div>
                    <Text h1 mb={0} pt={2} className="font-medium text-base">GENSHIN.US</Text>
                    <Text p small mt={0} className="secondary">{defaultSeo.description}</Text>
                </div>
            </nav>
            <Menu/>
        </>
    )
}