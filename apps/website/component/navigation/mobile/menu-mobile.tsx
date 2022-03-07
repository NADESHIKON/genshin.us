import React, { useMemo } from 'react'
import NextLink from 'next/link'
import { Sides } from '../sidebar/side-item'
import ChevronRightIcon from '@geist-ui/icons/chevronRight'
import { useRouter } from 'next/router'
import { useTheme } from "@geist-ui/core";
import routes from "@/config/routes";

interface Props {
    expanded: boolean
}

const MenuMobile: React.FC<Props> = ({ expanded }) => {
    const theme = useTheme()
    const router = useRouter()
    const [expandedGroupName, setExpandedGroupName] = React.useState<string | null>(null)

    const handleGroupClick = (name: string) => {
        setExpandedGroupName(expandedGroupName === name ? null : name)
    }

    if (!expanded) return null

    return (
        <div className="mobile-menu">
            <div className="content">
                {Object.keys(routes).map((name, index) => {
                    const route = routes[name];

                        return (<div
                            key={name}
                            className="fadein"
                            style={{animationDelay: `${(index + 1) * 50}ms`}}>
                            <button
                                className={`menu-item`}
                                onClick={() => router.push(route.path)}>
                                {route.label}
                            </button>
                        </div>)

                    }
                )}
            </div>

            <style jsx>{`
        .mobile-menu {
          position: fixed;
          top: var(--geist-page-nav-height);
          height: calc(100vh - var(--geist-page-nav-height));
          width: 100%;
          overflow-x: hidden;
          z-index: 999;
          box-sizing: border-box;
          background-color: ${theme.palette.background};
          overflow-y: auto;
        }
        .fadein {
          animation: fadeIn 200ms ease;
          animation-fill-mode: forwards;
          opacity: 0;
        }
        .menu-item {
          padding: 0 ${theme.layout.gapHalf};
          margin: 0 ${theme.layout.gap};
          height: 48px;
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          border-bottom: 1px solid ${theme.palette.accents_2};
          text-transform: capitalize;
          color: ${theme.palette.accents_6};
          cursor: pointer;
        }
        .menu-item :global(svg) {
          transform: translateX(${theme.layout.gapQuarterNegative});
          transition: transform 250ms ease;
        }
        .menu-item.expanded {
          border-bottom: none;
        }
        .menu-item.expanded :global(svg) {
          transform: rotate(90deg) translateY(${theme.layout.gapQuarter});
        }
        .group {
          background: ${theme.palette.accents_1};
          padding: 0 calc(${theme.layout.gap} * 1.5) ${theme.layout.gap};
          border-top: 1px solid ${theme.palette.accents_2};
        }
        .section-name {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: ${theme.palette.accents_5};
          margin-top: ${theme.layout.gap};
          margin-bottom: ${theme.layout.gapHalf};
        }
        .section-item {
          padding: ${theme.layout.gapQuarter} ${theme.layout.gap};
          margin: 0 ${theme.layout.gapQuarter};
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          color: ${theme.palette.accents_6};
          border-left: 1px solid ${theme.palette.accents_2};
        }
        .active {
          color: ${theme.palette.link};
          font-weight: 500;
        }
        @keyframes fadeIn {
          from {
            transform: translate3d(0, 0.375rem, 0);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    )
}

export default MenuMobile