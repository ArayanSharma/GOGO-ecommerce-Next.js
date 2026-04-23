'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Search from './Search';
import { FaRegHeart, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { RiArrowDropDownLine } from 'react-icons/ri';
import {
  HiOutlineShoppingBag, HiOutlineChevronRight,
  HiOutlineLocationMarker, HiOutlinePhone,
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { gsap } from 'gsap';

/* ─── Nav Data ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',               href: '/',         emoji: '🏠' },
  { label: 'Fruits & Veg',       href: '/products',  emoji: '🥦' },
  { label: 'Meat & Seafood',     href: '/products',  emoji: '🥩' },
  { label: 'Breakfast & Bakery', href: '/products',  emoji: '🥐' },
  { label: 'Beverages',          href: '/products',  emoji: '🧃' },
  { label: 'Frozen Food',        href: '/products',  emoji: '🧊' },
  { label: 'Biscuits & Snacks',  href: '/products',  emoji: '🍪' },
  { label: 'Grocery & Staples',  href: '/products',  emoji: '🛒' },
];

const MORE_LINKS = [
  { label: 'Dairy & Eggs',    href: '/products', emoji: '🥚', desc: 'Fresh every morning' },
  { label: 'Health & Beauty', href: '/products', emoji: '💊', desc: 'Wellness essentials' },
  { label: 'Baby Products',   href: '/products', emoji: '🍼', desc: 'Safe & certified' },
  { label: 'Pet Supplies',    href: '/products', emoji: '🐾', desc: 'For your furry friend' },
  { label: 'Cleaning & Home', href: '/products', emoji: '🧹', desc: 'Keep it spotless' },
];

/* ─── Ticker messages ───────────────────────────────── */
const TICKERS = [
  '🚚 Free delivery above ₹499',
  '🌿 100% Certified Organic',
  '⭐ 50,000+ Happy Customers',
  '🔄 Easy 7-Day Returns',
  '💳 Secure Payments',
];

export default function Header() {
  const { isAuthenticated, userName, userEmail, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount }     = useCart();

  const [showUserMenu,  setShowUserMenu]  = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMore,      setShowMore]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [tickerIdx,     setTickerIdx]     = useState(0);

  const headerRef   = useRef(null);
  const topBarRef   = useRef(null);
  const navBarRef   = useRef(null);
  const navItemsRef = useRef([]);
  const dropdownRef = useRef(null);
  const mobileRef   = useRef(null);
  const userMenuRef = useRef(null);
  const tickerRef   = useRef(null);

  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'My Account');

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ticker rotation */
  useEffect(() => {
    const id = setInterval(() => {
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          opacity: 0, y: -8, duration: 0.25, ease: 'power2.in',
          onComplete: () => {
            setTickerIdx(p => (p + 1) % TICKERS.length);
            gsap.fromTo(tickerRef.current,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
          },
        });
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* mount GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(topBarRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(navBarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: 'power3.out' }
      );
      gsap.fromTo(
        navItemsRef.current.filter(Boolean),
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.045, delay: 0.35, ease: 'power2.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  /* dropdown / menus */
  const animIn  = (el) => gsap.fromTo(el, { opacity: 0, y: -10, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
  const animOut = (el, done) => gsap.to(el, { opacity: 0, y: -6, scale: 0.95, duration: 0.16, ease: 'power2.in', onComplete: done });

  useEffect(() => { if (showMore     && dropdownRef.current) animIn(dropdownRef.current); }, [showMore]);
  useEffect(() => { if (showUserMenu && userMenuRef.current)  animIn(userMenuRef.current);  }, [showUserMenu]);

  useEffect(() => {
    if (showMobileNav && mobileRef.current) {
      gsap.fromTo(mobileRef.current,
        { x: '-100%' },
        { x: '0%', duration: 0.38, ease: 'power3.out' }
      );
    }
  }, [showMobileNav]);

  const closeMore = () => {
    if (!dropdownRef.current) return setShowMore(false);
    animOut(dropdownRef.current, () => setShowMore(false));
  };
  const closeUserMenu = () => {
    if (!userMenuRef.current) return setShowUserMenu(false);
    animOut(userMenuRef.current, () => setShowUserMenu(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .hdr-root { font-family:'Outfit',sans-serif; }

        /* ── nav link underline ── */
        .hl { position:relative; transition:color .2s ease; }
        .hl::after {
          content:''; position:absolute;
          bottom:0; left:50%; right:50%;
          height:2.5px; background:linear-gradient(90deg,#16a34a,#22c55e);
          border-radius:2px; transition:left .28s ease,right .28s ease;
        }
        .hl:hover { color:#15803d; }
        .hl:hover::after,
        .hl.active::after { left:0; right:0; }

        /* ── ghost btn ── */
        .gh-btn {
          transition:background .18s,color .18s,transform .14s,border-color .18s;
        }
        .gh-btn:hover { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; transform:translateY(-1px); }
        .gh-btn:active { transform:scale(.93); }

        /* ── cart pill ── */
        .cart-pill {
          transition:background .2s,box-shadow .2s,transform .15s;
        }
        .cart-pill:hover {
          background:linear-gradient(135deg,#15803d,#16a34a);
          box-shadow:0 8px 24px rgba(21,128,61,.35);
          transform:translateY(-2px);
        }
        .cart-pill:active { transform:scale(.94); }

        /* ── more item ── */
        .mi { transition:background .15s,padding-left .22s,color .15s; }
        .mi:hover { background:#f0fdf4; padding-left:1.1rem; color:#15803d; }

        /* ── mobile item ── */
        .mob-item { transition:background .15s,transform .18s; }
        .mob-item:hover { background:#f0fdf4; transform:translateX(5px); }

        /* ── user menu item ── */
        .um-item { transition:background .15s,color .15s; }
        .um-item:hover { background:#f0fdf4; color:#15803d; }

        /* ── badge pulse ── */
        @keyframes hdr-pulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.18); }
        }
        .badge-pulse { animation:hdr-pulse 1.8s ease-in-out infinite; }

        /* ── wishlist heart beat ── */
        @keyframes heartbeat {
          0%,100% { transform:scale(1); }
          30%     { transform:scale(1.25); }
          60%     { transform:scale(1.1); }
        }
        .heartbeat { animation:heartbeat .6s ease; }
      `}</style>

      <header
        ref={headerRef}
        className={`hdr-root sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_2px_32px_rgba(0,0,0,0.10)] border-b border-transparent'
            : 'border-b border-gray-100'
        }`}
      >

        {/* ══════════ ROW 0 — UTILITY BAR ══════════ */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 text-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-8 flex items-center justify-between text-[11px] font-medium">
            {/* left */}
            <div className="hidden md:flex items-center gap-5 text-white/70">
              <span className="flex items-center gap-1.5">
                <HiOutlinePhone size={12}/> +91 98765 43210
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineLocationMarker size={12}/> Delivering across India
              </span>
            </div>
            {/* center ticker */}
            <div ref={tickerRef} className="mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 tracking-wide font-medium text-white/90">
              {TICKERS[tickerIdx]}
            </div>
            {/* right */}
            <div className="hidden md:flex items-center gap-4 text-white/70">
              <Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link>
              <span className="w-px h-3 bg-white/20"/>
              <Link href="/help"        className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>
        </div>

        {/* ══════════ ROW 1 — MAIN BAR ══════════ */}
        <div
          ref={topBarRef}
          className="max-w-[1400px] mx-auto px-4 md:px-8 h-[68px] flex items-center gap-3"
        >

          {/* Hamburger */}
          <button
            className="gh-btn xl:hidden p-2 rounded-xl border border-transparent text-gray-500"
            onClick={() => setShowMobileNav(v => !v)}
            aria-label="Toggle menu"
          >
            {showMobileNav ? <AiOutlineClose size={22}/> : <AiOutlineMenu size={22}/>}
          </button>

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200 text-white font-extrabold text-lg">
              G
            </div>
            <div className="leading-none hidden sm:block">
              <span className="block font-extrabold text-[18px] text-green-700 tracking-tight">GOGO</span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-[.18em] uppercase">Grocery</span>
            </div>
          </Link>

          {/* ── Search ── */}
          <div className="flex-1 max-w-2xl mx-3 hidden sm:block">
            <Search />
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 ml-auto shrink-0">

            {/* USER */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => showUserMenu ? closeUserMenu() : setShowUserMenu(true)}
                  className="gh-btn flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent text-sm font-medium text-gray-600"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
                    <FaCircleUser size={19} className="text-green-600"/>
                  </div>
                  <span className="hidden lg:inline max-w-[90px] truncate font-semibold text-gray-700">{displayName}</span>
                  <RiArrowDropDownLine
                    size={18}
                    className={`hidden lg:inline text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {showUserMenu && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
                  >
                    {/* Avatar header */}
                    <div className="relative bg-gradient-to-br from-green-600 to-emerald-500 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/40">
                          <FaCircleUser size={26} className="text-white"/>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{displayName}</p>
                          {userEmail && <p className="text-[11px] text-white/70 truncate">{userEmail}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Menu items */}
                    <div className="p-1.5">
                      {[
                        { href:'/account', icon:<FaCircleUser size={14}/>,     label:'My Account'  },
                        { href:'/orders',  icon:<HiOutlineShoppingBag size={15}/>, label:'My Orders'   },
                        { href:'/wishlist',icon:<FaRegHeart size={13}/>,        label:'Wishlist',
                          badge: wishlistCount > 0 ? wishlistCount : null },
                      ].map(it => (
                        <Link key={it.label} href={it.href}
                          className="um-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 font-medium"
                          onClick={closeUserMenu}
                        >
                          <span className="text-green-600">{it.icon}</span>
                          {it.label}
                          {it.badge && (
                            <span className="ml-auto bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {it.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="h-px bg-gray-100 my-1 mx-2"/>
                      <button
                        onClick={() => { logout(); closeUserMenu(); }}
                        className="um-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 font-medium"
                      >
                        <FaSignOutAlt size={13}/> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login"
                  className="gh-btn px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200">
                  Log in
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-md shadow-green-200 transition-all duration-200 hover:scale-105 active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Divider */}
            <div className="w-px h-7 bg-gray-200 mx-1 hidden md:block"/>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="gh-btn relative p-2.5 rounded-xl border border-transparent text-gray-500"
            >
              {wishlistCount > 0
                ? <FaHeart size={19} className="text-rose-500"/>
                : <FaRegHeart size={19}/>
              }
              {wishlistCount > 0 && (
                <span className="badge-pulse absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="cart-pill relative flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-md shadow-green-200 ml-1"
            >
              <IoCartOutline size={20}/>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="badge-pulse absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-orange-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-md ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-3 -mt-1">
          <Search />
        </div>

        {/* ══════════ ROW 2 — CATEGORY NAV ══════════ */}
        <div
          ref={navBarRef}
          className="hidden xl:block border-t border-gray-100/80"
          style={{ background:'linear-gradient(to bottom, #fff 0%, #fafffe 100%)' }}
        >
          <div className="max-w-[1400px] mx-auto px-8">
            <nav className="flex items-center">
              {NAV_LINKS.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  ref={el => (navItemsRef.current[i] = el)}
                  className="hl px-4 py-3.5 text-[13.5px] font-semibold text-gray-600 whitespace-nowrap opacity-0 tracking-wide"
                >
                  {item.label}
                </Link>
              ))}

              {/* spacer */}
              <div className="flex-1"/>

              {/* More */}
              <div
                className="relative"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={closeMore}
              >
                <button
                  ref={el => (navItemsRef.current[NAV_LINKS.length] = el)}
                  className="hl flex items-center gap-0.5 px-4 py-3.5 text-[13.5px] font-semibold text-gray-600 opacity-0"
                >
                  More
                  <RiArrowDropDownLine
                    size={20}
                    className={`transition-transform duration-250 ${showMore ? 'rotate-180' : ''}`}
                  />
                </button>

                {showMore && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-0 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2.5 border-b border-gray-100">
                      <p className="text-[10px] font-extrabold text-green-700 uppercase tracking-[.18em]">
                        More Categories
                      </p>
                    </div>
                    <div className="p-2">
                      {MORE_LINKS.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMore}
                          className="mi flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600"
                        >
                          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-base shrink-0 shadow-sm">
                            {item.emoji}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-700 text-[13px]">{item.label}</div>
                            <div className="text-[11px] text-gray-400">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* ══════════ MOBILE DRAWER ══════════ */}
        {showMobileNav && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-40"
              onClick={() => setShowMobileNav(false)}
            />
            <div
              ref={mobileRef}
              className="fixed top-0 left-0 h-full w-[300px] bg-white z-50 flex flex-col shadow-2xl"
              style={{ transform:'translateX(-100%)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-green-600 to-emerald-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-extrabold text-white text-lg">G</div>
                  <div>
                    <span className="block font-extrabold text-white text-base tracking-tight">GOGO</span>
                    <span className="block text-[9px] text-white/70 uppercase tracking-widest">Grocery</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
                >
                  <AiOutlineClose size={19}/>
                </button>
              </div>

              {/* Auth state */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-green-50/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0 ring-2 ring-green-200">
                    <FaCircleUser size={22} className="text-green-600"/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                    {userEmail && <p className="text-xs text-gray-400 truncate">{userEmail}</p>}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5 px-4 py-3.5 border-b border-gray-100">
                  <Link href="/login" onClick={() => setShowMobileNav(false)}
                    className="flex-1 text-center py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-green-300 hover:bg-green-50 transition-colors">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setShowMobileNav(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-md shadow-green-200 transition-all hover:scale-105">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="px-2 pb-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-[.18em]">
                  Categories
                </p>
                {[...NAV_LINKS, ...MORE_LINKS].map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowMobileNav(false)}
                    className="mob-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-700 mb-0.5"
                  >
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-lg shrink-0 shadow-sm border border-green-100/60">
                      {item.emoji}
                    </span>
                    {item.label}
                    <HiOutlineChevronRight size={14} className="ml-auto text-gray-300"/>
                  </Link>
                ))}
              </div>

              {/* Footer actions */}
              <div className="px-4 py-4 border-t border-gray-100 flex gap-2.5">
                <Link href="/wishlist" onClick={() => setShowMobileNav(false)}
                  className="flex-1 relative flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <FaRegHeart size={15}/>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link href="/cart" onClick={() => setShowMobileNav(false)}
                  className="flex-1 relative flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-md shadow-green-200 hover:scale-105 transition-transform">
                  <IoCartOutline size={17}/>
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-1.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {isAuthenticated && (
                <div className="px-4 pb-6">
                  <button
                    onClick={() => { logout(); setShowMobileNav(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors"
                  >
                    <FaSignOutAlt size={14}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>
    </>
  );
}