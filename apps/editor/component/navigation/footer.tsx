import { Text, useTheme } from "@geist-ui/core";

export default function Footer() {
    const theme = useTheme();

    return (
        <footer className="flex select-none items-center space-between my-5 mx-auto max-w-full" style={{ height: "54px", width: theme.layout.pageWidthWithMargin, padding: theme.layout.pageMargin }}>
            <div className="flex flex-col space-y-5">
                <Text>GENSHIN.US</Text>
                <Text>Fan-database for Genshin Impact</Text>
            </div>
        </footer>
    )
}