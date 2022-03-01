import { useTheme } from '@geist-ui/core';

export default function PageContainer({ children }) {
    const theme = useTheme();

    return (
        <>
            <div className="wrapper scrollbar scrollbar-track-gray-700">
                <div className="content">
                    {children}
                </div>
            </div>
            <style jsx>{`
        .wrapper {
          background-color: ${theme.palette.accents_1};
          min-height: calc(100vh - 172px);
        }
        .content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: calc(${theme.layout.unit} * 2) ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
      `}</style>
        </>
    )
}