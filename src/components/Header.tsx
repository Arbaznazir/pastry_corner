

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  onOrdersClick: () => void
  onCustomOrderClick: () => void
}

export default function Header({ cartCount, onCartClick, onOrdersClick, onCustomOrderClick }: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-4 md:gap-6">
            <img src="/logo.png" alt="Pastry Corner" className="h-10 md:h-12 w-auto object-contain" />
            <div className="flex-col hidden md:flex mt-1">
              <h1 className="text-xl font-serif text-white tracking-[0.2em] font-medium leading-none uppercase">Pastry Corner</h1>
              <p className="text-[9px] font-sans tracking-[0.3em] text-gold-600 uppercase mt-1.5">Artisan Patisserie</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </div>
    </header>
  )
}