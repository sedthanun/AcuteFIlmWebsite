import './globals.css';
import './ai-chat/ai-chat.css';
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
  metadataBase: new URL('https://acutefilmmovies.web.app'),
  title: 'AcuteFilm | Media Production',
  description: 'Acute Film - Video Production, Visual Effects, Motion Graphics',
  openGraph: {
    siteName: 'AcuteFilm',
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AcuteFilm',
    'url': 'https://acutefilmmovies.web.app',
  };

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={anuphan.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <Script src="https://kit.fontawesome.com/6719d38d22.js" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
