import { useEffect, useMemo, useState, useRef } from 'react';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';

const STORAGE_KEY = 'news_portal_lang';

// Flag component using SVG data URIs
const FlagIcon = ({ code }) => {
  const flags = {
    en: (
      <svg viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    ),
    hi: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <path fill="#FF9933" d="M0 0h9v2H0z"/>
        <path fill="#fff" d="M0 2h9v2H0z"/>
        <path fill="#138808" d="M0 4h9v2H0z"/>
        <circle cx="4.5" cy="3" r="0.8" fill="#000080"/>
      </svg>
    ),
    mr: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <path fill="#FF9933" d="M0 0h9v2H0z"/>
        <path fill="#fff" d="M0 2h9v2H0z"/>
        <path fill="#138808" d="M0 4h9v2H0z"/>
        <circle cx="4.5" cy="3" r="0.8" fill="#000080"/>
      </svg>
    ),
    gu: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <path fill="#FF9933" d="M0 0h9v2H0z"/>
        <path fill="#fff" d="M0 2h9v2H0z"/>
        <path fill="#138808" d="M0 4h9v2H0z"/>
        <circle cx="4.5" cy="3" r="0.8" fill="#000080"/>
      </svg>
    ),
    bn: (
      <svg viewBox="0 0 10 6" className="w-5 h-3.5 rounded-sm">
        <rect width="10" height="6" fill="#006A4E"/>
        <circle cx="4.5" cy="3" r="2" fill="#F42A41"/>
      </svg>
    ),
    ta: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <rect width="9" height="6" fill="#000080"/>
        <circle cx="3" cy="3" r="1.2" fill="#fff"/>
        <circle cx="3" cy="3" r="0.8" fill="#000080"/>
      </svg>
    ),
    te: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <rect width="9" height="3" fill="#FF9933"/>
        <rect y="3" width="9" height="3" fill="#fff"/>
        <rect y="4.5" width="9" height="1.5" fill="#138808"/>
      </svg>
    ),
    ur: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <rect width="9" height="6" fill="#01411C"/>
        <circle cx="3.5" cy="3" r="1.2" fill="#fff"/>
        <path d="M5 1.5 L5.3 2.5 L6.3 2.5 L5.5 3.1 L5.8 4.1 L5 3.5 L4.2 4.1 L4.5 3.1 L3.7 2.5 L4.7 2.5 Z" fill="#fff"/>
      </svg>
    ),
    ar: (
      <svg viewBox="0 0 9 6" className="w-5 h-3.5 rounded-sm">
        <path fill="#CE1126" d="M0 0h9v2H0z"/>
        <path fill="#fff" d="M0 2h9v2H0z"/>
        <path fill="#000" d="M0 4h9v2H0z"/>
        <path d="M2 2.5l1 0.5-1 0.5-0.5-1z" fill="#007A3D"/>
      </svg>
    ),
  };

  return flags[code] || <FiGlobe className="w-5 h-5 text-gray-500" />;
};

const LanguageSwitcher = () => {
  const languages = useMemo(
    () => [
      { code: 'en', label: 'English', nativeName: 'English' },
      { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
      { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
      { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'ur', label: 'Urdu', nativeName: 'اردو' },
      { code: 'ar', label: 'Arabic', nativeName: 'العربية' },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'en';
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on window resize
  useEffect(() => {
    const handleResize = () => {
      if (open) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  const isReady = () => {
    const combo = document.querySelector('.goog-te-combo');
    return Boolean(combo);
  };

  const applyLang = (lang) => {
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;

    combo.value = lang;
    combo.dispatchEvent(new Event('change'));
    return true;
  };

  useEffect(() => {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (isReady()) {
        clearInterval(timer);
        applyLang(current);
      }
      if (tries > 40) {
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [current]);

  const onSelect = (code) => {
    setCurrent(code);
    localStorage.setItem(STORAGE_KEY, code);
    setOpen(false);
    applyLang(code);
  };

  const currentLang = languages.find((l) => l.code === current) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Custom Language Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
          open 
            ? 'bg-red-600 border-red-600 text-white' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-red-400 hover:bg-gray-50'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FlagIcon code={current} />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <FiChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Custom Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50 animate-fade-in"
          style={{
            animation: 'fadeInDown 0.2s ease-out',
            maxHeight: '320px',
            overflowY: 'auto'
          }}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                lang.code === current 
                  ? 'bg-red-50 text-red-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-500'
              }`}
            >
              <FlagIcon code={lang.code} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className="text-xs opacity-70">{lang.nativeName}</span>
              </div>
              {lang.code === current && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
