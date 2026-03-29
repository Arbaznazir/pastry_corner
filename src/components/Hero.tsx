import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/pastry_corner.jpg" 
          alt="Pastry Corner Artisan" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity duration-[3s] ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center gap-8"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gold-400 opacity-50 mb-4" />
          <span className="text-[10px] tracking-[0.4em] text-gold-600 uppercase font-light">The Art of Pastry</span>
          
          <h2 className="text-6xl md:text-[7rem] font-serif text-white leading-[1] tracking-normal font-light">
            Edible <br className="hidden md:block" />
            <span className="italic text-gold-500 block mt-2">Masterpieces</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-zinc-300 mb-16 max-w-xl mx-auto font-light leading-relaxed tracking-wide opacity-80"
        >
          Curated with precision, crafted with passion. Every creation is a testament to the timeless elegance of French pastry artistry.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <button className="px-12 py-4 bg-espresso-900 rounded-full text-black text-[11px] tracking-[0.3em] uppercase hover:bg-gold-500 hover:shadow-lg transition-all duration-500">
            Discover
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 w-px h-24 bg-gradient-to-b from-gold-400 to-transparent opacity-50"
        />
      </div>
    </section>
  )
}