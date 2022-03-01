import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from "@geist-ui/core";

class GenshinDocument extends Document {
    constructor(props) {
        super(props);
    }

    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        const styles = CssBaseline.flush();

        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    {styles}
                </>
            )
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default GenshinDocument;