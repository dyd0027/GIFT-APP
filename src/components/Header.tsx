// components/Header.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { logout, user } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => logout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="absolute top-0 flex w-full items-center justify-between bg-[#222] px-4 py-3 text-white shadow-md">
      <div className="text-xl font-bold">
        <Link href="/">🎁 선물하기</Link>
      </div>
      {user && (
        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={toggleMenu}
            className="p-2 focus:outline-none"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl bg-white text-black shadow-xl"
              >
                <ul className="flex flex-col divide-y">
                  {user.LOGIN_ID === process.env.NEXT_PUBLIC_ADMIN_ID && (
                    <li>
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-indigo-100"
                        onClick={toggleMenu}
                      >
                        관리자페이지
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/page1"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={toggleMenu}
                    >
                      1번 페이지
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page2"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={toggleMenu}
                    >
                      2번 페이지
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page3"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={toggleMenu}
                    >
                      3번 페이지
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page4"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={toggleMenu}
                    >
                      4번 페이지
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-100"
                    >
                      로그아웃
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  );
}
