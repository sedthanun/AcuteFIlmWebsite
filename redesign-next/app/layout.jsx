import './globals.css';
import './navbar.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Script from 'next/script';
import { Anuphan } from 'next/font/google';

const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-anuphan',
});

export const metadata = {
  metadataBase: new URL('https://acutefilmmovies-v3.web.app'),
  title: 'AcuteFilm | Media Production',
  description: 'Acute Film - Video Production, Visual Effects, Motion Graphics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={anuphan.variable}>
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <Script src="https://kit.fontawesome.com/6719d38d22.js" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
