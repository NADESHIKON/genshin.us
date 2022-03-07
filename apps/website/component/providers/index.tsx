import { createContext, useState } from 'react';
import { GeistProvider, CssBaseline, Themes } from '@geist-ui/core';

const globalNavigationContext = {
    open: false,
    setOpen: (val: boolean) => {},
}

export const GlobalNavigationContext = createContext(
    globalNavigationContext
)

const theme = Themes.createFromDark({
    type: "genshin",
    palette: {
        selection: "#ACCEF7"
    }
});

export function Providers({ children }) {
    const initialState = {
        open: false,
        setOpen
    }

    const [state, setState] = useState(initialState)

    function setOpen(open) {
        return setState({ ...state, open })
    }

    return (
        <>
            <GlobalNavigationContext.Provider value={state}>
                <GeistProvider themeType="dark">
                    <CssBaseline/>
                    {children}
                </GeistProvider>
            </GlobalNavigationContext.Provider>
        </>
    )
}