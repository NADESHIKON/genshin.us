import { useContext, useEffect, useState } from 'react';
import { GlobalNavigationContext } from '@/component/providers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Tabs, useBodyScroll, useMediaQuery, useTheme } from '@geist-ui/core';
import routes from "@/config/routes";
import MenuMobile from "@/component/navigation/mobile/menu-mobile";
import { Menu as MenuIcon } from '@geist-ui/icons';

export default function Menu(props) {
    const { open } = useContext(GlobalNavigationContext);

    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();
    const router = useRouter();
    const [sticky, setSticky] = useState(false);
    const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
    const isMobile = useMediaQuery('xs', { match: 'down' })

    useEffect(() => {
        setBodyHidden(expanded)
    }, [expanded]);

    useEffect(() => {
        const scrollHandler = () => setSticky(document.documentElement.scrollTop > 54);
        document.addEventListener("scroll", scrollHandler);
        return () => document.removeEventListener("scroll", scrollHandler);
    }, [setSticky]);

    useEffect(() => {
        if (!isMobile) {
            setExpanded(false)
        }
    }, [isMobile]);

    return (
        <>
            <nav className="menu">
                <div className={sticky ? "menu-sticky" : ""}>
                    <div className="menu-inner">
                        <Tabs highlight={false} value={router.asPath} onChange={(route) => router.push(route)}>
                            {Object.keys(routes).map(name => {
                                const route = routes[name];

                                return (
                                    <Tabs.Item key={name} label={route.label} value={route.path}/>
                                )
                            })}
                        </Tabs>
                    </div>
                    <div className="controls">
                        {isMobile ? (
                            <Button
                                className="menu-toggle"
                                auto
                                type="abort"
                                onClick={() => setExpanded(!expanded)}>
                                <MenuIcon size="1.125rem" />
                            </Button>
                        ) : (
                            null
                        )}
                    </div>
                    <MenuMobile expanded={expanded}/>

                </div>
            </nav>
            <style jsx>{`
                .menu {
                    height: 48px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 0 -1px ${theme.palette.border};
                }
                
                .menu-sticky {
                    transition: box-shadow 0.2s ease;
                    position: fixed;
                    z-index: 1100;
                    top: 0;
                    right: 0;
                    left: 0;
                    background: ${theme.palette.background};
                    box-shadow: inset 0 -1px ${theme.palette.border};
                }
                
                .menu-inner {
                    display: flex;
                    width: ${theme.layout.pageWidthWithMargin};
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 0 ${theme.layout.pageMargin};
                    height: 48px;
                    box-sizing: border-box;
                    overflow-y: hidden;
                    overflow-x: auto;
                    overflow: -moz-scrollbars-none;
                    -ms-overflow-style: none;
                    -webkit-overflow-scrolling: touch;
                    box-sizing: border-box;                
                }
                
                .menu-inner::-webkit-scrollbar {
                    visibility: hidden;
                }
                .menu-inner :global(.content) {
                    display: none;
                }
                .menu-inner :global(.tabs),
                .menu-inner :global(header) {
                    height: 100%;
                    border: none;
                }
                .menu-inner :global(.tab) {
                    height: calc(100% - 2px);
                    padding-top: 0;
                    padding-bottom: 0;
                    color: ${theme.palette.accents_5};
                    font-size: 0.875rem;
                }
                .menu-inner :global(.tab):hover {
                    color: ${theme.palette.foreground};
                }
                .menu-inner :global(.active) {
                    color: ${theme.palette.foreground};
                }
                
                @media only screen and (max-width: ${theme.breakpoints.xs.max}) {
                    .menu-inner {
                        display: none;
                    }
                }
                
                .controls {
                    flex: 1 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
                
                .controls :global(.menu-toggle) {
                    display: flex;
                    align-items: center;
                    min-width: 40px;
                    height: 40px;
                    padding: 0;
                }
            `}</style>
        </>
    )
}