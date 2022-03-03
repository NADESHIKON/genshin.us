import Meh from '@geist-ui/icons/meh';
import { Text } from "@geist-ui/core";

export default function NotFound(props) {
    return (
        <div className="flex flex-col items-center w-full select-none">
            <div className="flex flex-row">
                <p style={{ fontSize: "128px" }}>4</p>
                <div className="flex content-center justify-self-center justify-items-center items-center place-items-center" style={{ margin: "1em 0" }}>
                    <Meh size={128} style={{ margin: "1em 0" }}/>
                </div>
                <p style={{ fontSize: "128px" }}>4</p>
            </div>
            <Text>The page you are looking for does not exist.</Text>
        </div>
    )
}