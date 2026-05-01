'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Compact SVG Components
const MenuIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownActive(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

  if (pathname === '/admin') return null;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled shadow-lg bg-black/70 backdrop-blur-md' : 'bg-transparent'} fixed top-0 w-full z-[1000] flex justify-between items-center transition-all duration-300`}>
      <Link href="/" className="navbar-brand">
        <img src="/img/logo-new.png" alt="AcuteFilm Logo" className={`transition-all duration-300 ${isScrolled ? 'h-[60px]' : 'h-[80px]'}`} />
      </Link>

      <ul className={`nav-links fixed top-0 right-0 w-full h-dvh bg-black/95 flex flex-col transition-transform duration-500 ease-in-out z-[1050] ${isMobileMenuOpen ? 'translate-x-0 active' : 'translate-x-full'} md:static md:w-auto md:h-auto md:bg-transparent md:flex-row md:items-center md:gap-10 md:ml-auto md:transition-none md:translate-x-0`}>
        
        {/* Mobile Header: Bigger Logo & Aligned with the Menu Toggle area */}
        <li className="md:hidden flex justify-between items-center w-full h-[80px] px-[1.2rem] border-b border-white/5 mb-6">
          <img src="/img/logo-new.png" alt="AcuteFilm Logo" className="h-[60px] w-auto object-contain" />
          {/* Empty div to balance space if needed, though the absolute button sits over this area */}
          <div className="w-10 h-10"></div> 
        </li>

        <li className="w-full md:w-auto px-8 md:px-0">
          <Link href="/" onClick={closeMobileMenu} className={`block py-3 md:py-0 text-2xl md:text-lg uppercase tracking-wider transition-colors ${pathname === '/' ? 'text-white drop-shadow-[0_0_10px_rgba(99,222,241,0.5)]' : 'text-gray-400 hover:text-white'}`}>
            หน้าแรก
          </Link>
        </li>
        <li className={`dropdown group relative w-full md:w-auto px-8 md:px-0 ${isDropdownActive ? 'active' : ''}`}>
          <a 
            href="#" 
            onClick={(e) => { if (window.innerWidth <= 768) { e.preventDefault(); setIsDropdownActive(!isDropdownActive); } }} 
            className="relative flex items-center justify-between md:justify-center py-3 md:py-0 text-2xl md:text-lg uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors md:after:absolute md:after:top-full md:after:-left-4 md:after:w-[calc(100%+32px)] md:after:h-[25px] md:after:content-['']"
          >
            ผลงาน <ChevronDownIcon className="ml-2 transition-transform duration-300" size={20} />
          </a>
          <div className={`dropdown-content mt-2 md:mt-0 min-w-[200px] bg-black/90 backdrop-blur-lg rounded-xl border border-white/10 py-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-[2000] ${isDropdownActive ? 'block opacity-100 visible translate-y-0' : 'hidden opacity-0 invisible translate-y-2'} md:block md:opacity-0 md:invisible md:translate-y-[-10px] md:[clip-path:inset(-20px_-50px_100%_-50px)] md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:[clip-path:inset(-20px_-50px_-50px_-50px)] absolute md:top-[calc(100%+20px)] left-0 md:left-1/2 md:-translate-x-1/2`}>
            <Link href="/movies" className="block py-3 px-6 text-gray-400 hover:text-white transition-colors">ภาพยนตร์</Link>
            <Link href="/services" className="block py-3 px-6 text-gray-400 hover:text-white transition-colors">ลูกค้าของเรา</Link>
          </div>
        </li>
        <li className="w-full md:w-auto px-8 md:px-0">
          <Link href="/news" className={`block py-3 md:py-0 text-2xl md:text-lg uppercase tracking-wider transition-colors ${pathname.startsWith('/news') ? 'text-white drop-shadow-[0_0_10px_rgba(99,222,241,0.5)]' : 'text-gray-400 hover:text-white'}`}>
            ข่าวสาร
          </Link>
        </li>
        <li className="w-full md:w-auto px-8 md:px-0">
          <Link href="/about-us" className={`block py-3 md:py-0 text-2xl md:text-lg uppercase tracking-wider transition-colors ${pathname === '/about-us' ? 'text-white drop-shadow-[0_0_10px_rgba(99,222,241,0.5)]' : 'text-gray-400 hover:text-white'}`}>
            ติดต่อเรา
          </Link>
        </li>

        {/* Mobile Social Icons: Moved further down with pb-32 */}
        <li className="md:hidden mt-auto w-full px-8 pt-10 pb-32 border-t border-white/5 flex flex-col items-center">
          <p className="text-gray-500 text-[0.7rem] uppercase tracking-[4px] mb-6">Connect with us</p>
          <div className="flex gap-10">
            <a href="https://www.facebook.com/acutefilm" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-2xl transition-all duration-300 hover:scale-110"><i className="fab fa-facebook"></i></a>
            <a href="https://www.youtube.com/@acutefilm" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-2xl transition-all duration-300 hover:scale-110"><i className="fab fa-youtube"></i></a>
            <a href="https://github.com/sedthanun/AcuteFIlmWebsite/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-2xl transition-all duration-300 hover:scale-110"><i className="fab fa-github"></i></a>
          </div>
        </li>
      </ul>

      <button 
        className="menu-toggle md:hidden relative z-[2000] p-2 text-white hover:bg-white/10 rounded-full transition-all duration-300" 
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          <MenuIcon className={`absolute transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} size={32} />
          <XIcon className={`absolute transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} size={32} />
        </div>
      </button>
    </nav>
  );
}