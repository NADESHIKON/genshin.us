import ReactMarkdown from 'react-markdown';
import { Text, useTheme } from '@geist-ui/core';

export default function Markdown({ text, highlightColor = "", my = 0.5, mx = 0.5}) {
    const theme = useTheme();

    return <>
        <ReactMarkdown
            children={text}
            components={{
                li: ({node, ...props}) => <li style={{
                    listStyleType: "disc", marginTop: 0, marginBottom: 0, color: theme.palette.accents_7,
                    // @ts-ignore
                    "&::before": {
                        content: ""
                    }
                }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ marginTop: 0, marginBottom: 0 }} {...props} />,
                strong: ({node, ...props}) => <strong style={{ color: highlightColor || theme.palette.accents_7 }} {...props} />,
                p: ({node, ...props}) => <Text style={{ color: theme.palette.accents_7 }} my={my} p {...props} />
            }}
        />
    </>
}