'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/admin') return null;

  return (
    <footer>
        <div className="social-links">
            <a href="https://github.com/sedthanun/AcuteFIlmWebsite/"><i className="fab fa-github"></i></a>
            <a href="https://www.youtube.com/@acutefilm"><i className="fab fa-youtube"></i></a>
            <a href="https://www.facebook.com/acutefilm"><i className="fab fa-facebook"></i></a>
        </div>
        <p className="copyright">All rights reserved. <a href="https://jjds.web.app/" target="_blank" rel="noopener noreferrer">JJDS</a> 2026</p>
    </footer>
  );
}
