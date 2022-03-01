import { useContext, useEffect, useState } from 'react';
import { GlobalNavigationContext } from '@/component/providers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tabs, useTheme } from '@geist-ui/core';
import routes from "@/config/routes";

export default function Menu(props) {
    const { open } = useContext(GlobalNavigationContext);
    const theme = useTheme();
    const router = useRouter();
    const [sticky, setSticky] = useState(false);

    useEffect(() => {
        const scrollHandler = () => setSticky(document.documentElement.scrollTop > 54);
        document.addEventListener("scroll", scrollHandler);
        return () => document.removeEventListener("scroll", scrollHandler);
    }, [setSticky]);

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
            `}</style>
        </>
    )
}