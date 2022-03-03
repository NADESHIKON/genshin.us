import Meh from '@geist-ui/icons/meh';
import { Text } from "@geist-ui/core";

export default function Error({ statusCode }) {
    return (
        <div className="flex flex-col items-center w-full select-none">
            <div className="flex flex-row">
                {statusCode.split("").map(character => {
                    if (character === "0") return (
                        <div className="flex content-center justify-self-center justify-items-center items-center place-items-center" style={{ margin: "1em 0" }}>
                            <Meh size={128} style={{ margin: "1em 0" }}/>
                        </div>
                    )

                    return <p style={{ fontSize: "128px" }}>{character}</p>
                })}
            </div>
            <Text>The page you are looking for does not exist.</Text>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    return {
        statusCode
    }
}