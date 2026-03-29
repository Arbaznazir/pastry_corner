import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../types";
import { useProducts } from "../hooks/useProducts";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { products, loading } = useProducts();

  const categories = [
    { id: "all", name: "All Menu" },
    { id: "pastry", name: "Pastry" },
    { id: "biscuits", name: "Biscuits & Cookies" },
    { id: "cakes", name: "Tea Cakes" },
    { id: "savory", name: "Savory & Puff" },
    { id: "namkeen", name: "Namkeen" },
  ];

  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }
      return true;
    });

  return (
    <section className="py-24 px-6 lg:px-8 bg-black" id="collection">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.4em] text-gold-600 uppercase font-light mb-6">La Sélection</span>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 font-light tracking-wide">
            Our Private <span className="italic text-gold-500">Collection</span>
          </h3>
          <div className="w-12 h-px bg-gold-400 opacity-50 mb-10" />
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-10 mb-20">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative pb-2 text-[11px] tracking-[0.3em] uppercase transition-all duration-500 ${
                selectedCategory === category.id
                  ? "text-white font-medium"
                  : "text-zinc-400 hover:text-gold-600"
              }`}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-[2rem] bg-zinc-900 animate-pulse mb-6" />
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-3" />
                <div className="h-3 w-20 bg-zinc-900 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                key={product.id}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] w-full mb-6 bg-zinc-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-6 right-6 text-white font-bold text-[9px] tracking-[0.2em] uppercase bg-red-600 px-4 py-2 rounded-full shadow-lg shadow-red-900/40 z-10">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                    </div>
                  )}
                  {product.popular && !product.isEidSpecial && (
                    <div className="absolute top-6 left-6 text-white text-[9px] tracking-[0.3em] uppercase bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-full hairline-border">
                      Signature
                    </div>
                  )}
                  {product.mostInDemand && !product.isEidSpecial && !product.popular && (
                    <div className="absolute top-6 left-6 text-orange-300 text-[9px] tracking-[0.3em] uppercase bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-full hairline-border">
                      Most in Demand
                    </div>
                  )}
                  {product.isEidSpecial && (
                    <div className="absolute top-6 left-6 text-gold-500 font-medium text-[9px] tracking-[0.3em] uppercase bg-black/95 backdrop-blur-md px-4 py-2 rounded-full hairline-border-gold shadow-lg">
                      Eid Special
                    </div>
                  )}
                  
                  {/* Hover Add Button Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-zinc-950 text-white rounded-full px-8 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-gold-500 hover:text-black hover:shadow-lg transition-all duration-500 flex items-center gap-3"
                    >
                      <PlusIcon className="w-3 h-3 stroke-[1.5]" />
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center px-4 w-full">
                  <h4 className="text-2xl font-serif text-white font-light mb-3">
                    {product.name}
                  </h4>
                  <p className="text-zinc-400 font-sans text-xs font-light leading-relaxed mb-4 max-w-sm">
                    {product.description}
                  </p>
                  <span className={`text-sm font-sans tracking-widest mt-auto ${product.originalPrice ? 'text-red-500' : 'text-gold-600'}`}>
                    {product.originalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through mr-2">
                        Rs. {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    Rs. {product.price.toFixed(2)}
                    {product.unit && (
                      <span className="text-[10px] text-zinc-300/50 lowercase ml-1 tracking-wider">
                        / {product.unit}
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </div>
    </section>
  );
}
