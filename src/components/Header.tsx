import { useState } from 'react'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  onOrdersClick: () => void
  onCustomOrderClick: () => void
}

export default function Header({ cartCount, onCartClick, onOrdersClick, onCustomOrderClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuClick = (action: () => void) => {
    action()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-6">
            <img src="/logo.png" alt="Pastry Corner" className="h-10 md:h-12 w-auto object-contain" />
            <div className="flex flex-col mt-1">
              <h1 className="text-sm md:text-xl font-serif text-white tracking-[0.15em] md:tracking-[0.2em] font-medium leading-none uppercase">Pastry Corner</h1>
              <p className="text-[8px] md:text-[9px] font-sans tracking-[0.25em] md:tracking-[0.3em] text-gold-600 uppercase mt-1 md:mt-1.5">Artisan Patisserie</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <button
              onClick={onCustomOrderClick}
              className="font-sans text-xs tracking-[0.2em] uppercase text-gold-500 hover:text-white transition-colors hidden sm:block"
            >
              Bespoke Request
            </button>
            <button
              onClick={onOrdersClick}
              className="font-sans text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-gold-600 transition-colors hidden sm:block mr-4"
            >
              Recent Orders
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="group relative flex items-center gap-3 text-white hover:text-gold-600 transition-colors"
            >
            <span className="font-sans text-xs tracking-[0.2em] uppercase hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="bg-gold-500 text-black text-[10px] tracking-widest px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
            <svg className="w-5 h-5 stroke-[1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>

            {/* Mobile Hamburger Menu - Elegant Minimal Design */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-zinc-400 hover:text-gold-500 transition-all duration-300 p-1"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => handleMobileMenuClick(onCustomOrderClick)}
                className="w-full text-left font-sans text-sm tracking-[0.2em] uppercase text-gold-500 hover:text-white transition-colors py-3 border-b border-white/5"
              >
                Bespoke Request
              </button>
              <button
                onClick={() => handleMobileMenuClick(onOrdersClick)}
                className="w-full text-left font-sans text-sm tracking-[0.2em] uppercase text-zinc-400 hover:text-gold-600 transition-colors py-3"
              >
                Recent Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}