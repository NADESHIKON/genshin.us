import Header from '@/component/navigation/header';
import NextNProgress from 'nextjs-progressbar';

export default function Layout({ children }) {
    return (
        <>
            <NextNProgress
                color="#FFF"
            />
            <Header/>
            {children}
        </>
    )
}