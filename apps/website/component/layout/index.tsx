import Header from '@/component/navigation/header';
import NextNProgress from 'nextjs-progressbar';
import Footer from "@/component/navigation/footer";

export default function Layout({ children }) {
    return (
        <>
            <NextNProgress
                color="#FFF"
            />
            <Header/>
            {children}
            <Footer/>
        </>
    )
}