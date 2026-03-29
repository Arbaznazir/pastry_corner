import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

const CATEGORIES = [
  { id: 'biscuits', name: 'Biscuits & Cookies' },
  { id: 'cakes', name: 'Tea Cakes' },
  { id: 'savory', name: 'Savory & Puff' },
  { id: 'namkeen', name: 'Namkeen' },
  { id: 'pastry', name: 'Pastry' },
];

const IMAGES = {
  biscuits: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
  puff: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&q=80",
  teacake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  namkeen: "https://images.unsplash.com/photo-1605493725880-993d05282420?w=800&q=80",
  eid: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
};

const DEFAULT_IMAGE_FOR: Record<string, string> = {
  biscuits: IMAGES.biscuits,
  cakes: IMAGES.teacake,
  savory: IMAGES.puff,
  namkeen: IMAGES.namkeen,
  pastry: IMAGES.eid,
};

const BLANK_PRODUCT = {
  name: '',
  description: '',
  price: '',
  category: 'biscuits',
  image: '',
  unit: '',
  popular: false,
  most_in_demand: false,
  is_eid_special: false,
};

// Convert Google Drive sharing link to direct image URL
const convertGDriveLink = (url: string): string => {
  if (!url.includes('drive.google.com')) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // Use googleusercontent.com for better embedding support
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<'prices' | 'discounts' | 'products' | 'add'>('prices');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [newProduct, setNewProduct] = useState<typeof BLANK_PRODUCT>({ ...BLANK_PRODUCT });

  // Local unsaved price edits
  const [priceEdits, setPriceEdits] = useState<Record<number, string>>({});

  // Edit product state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // Selected product discount state
  const [selectedForDiscount, setSelectedForDiscount] = useState<Set<number>>(new Set());
  const [productDiscountPercent, setProductDiscountPercent] = useState('');

  // Google Drive link converter state
  const [gdriveLinkInput, setGdriveLinkInput] = useState('');
  const [convertedLink, setConvertedLink] = useState('');

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('sort_order');
    if (error) { console.error(error); return; }
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  // ── PRICE EDITING ─────────────────────────
  const handleSavePrices = async () => {
    if (Object.keys(priceEdits).length === 0) return;
    setSaving(true);
    for (const [idStr, priceStr] of Object.entries(priceEdits)) {
      const id = parseInt(idStr);
      const newPrice = parseFloat(priceStr);
      if (isNaN(newPrice)) continue;
      // Only update price — never touch original_price here.
      // original_price is only set by the Bulk Discount feature.
      await supabase.from('products').update({ price: newPrice }).eq('id', id);
    }
    setPriceEdits({});
    await fetchProducts();
    setSaving(false);
    flash();
  };

  const handleResetPrice = async (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product?.original_price) return;
    await supabase.from('products').update({ price: product.original_price, original_price: null }).eq('id', id);
    await fetchProducts();
    flash();
  };

  // ── CATEGORY / BULK DISCOUNT ──────────────
  const handleCategoryDiscount = async () => {
    const pct = parseFloat(discountPercent);
    if (isNaN(pct) || pct <= 0 || pct >= 100) return;
    setSaving(true);
    const targets = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
    for (const p of targets) {
      const base = p.original_price ?? p.price;
      const discounted = parseFloat((base * (1 - pct / 100)).toFixed(2));
      await supabase.from('products').update({ price: discounted, original_price: base }).eq('id', p.id);
    }
    await fetchProducts();
    setSaving(false);
    flash();
  };

  // ── SELECTED PRODUCT DISCOUNT ─────────────
  const handleSelectedProductDiscount = async () => {
    const pct = parseFloat(productDiscountPercent);
    if (isNaN(pct) || pct <= 0 || pct >= 100 || selectedForDiscount.size === 0) return;
    setSaving(true);
    for (const id of selectedForDiscount) {
      const p = products.find(prod => prod.id === id);
      if (!p) continue;
      const base = p.original_price ?? p.price;
      const discounted = parseFloat((base * (1 - pct / 100)).toFixed(2));
      await supabase.from('products').update({ price: discounted, original_price: base }).eq('id', p.id);
    }
    setSelectedForDiscount(new Set());
    setProductDiscountPercent('');
    await fetchProducts();
    setSaving(false);
    flash();
  };

  const toggleProductSelection = (id: number) => {
    setSelectedForDiscount(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResetAllDiscounts = async () => {
    setSaving(true);
    const discounted = products.filter(p => p.original_price != null);
    for (const p of discounted) {
      await supabase.from('products').update({ price: p.original_price, original_price: null }).eq('id', p.id);
    }
    await fetchProducts();
    setSaving(false);
    flash();
  };

  // ── EDIT PRODUCT ──────────────────────────
  const startEditing = (product: any) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      image: product.image || '',
      unit: product.unit || '',
      popular: product.popular ?? false,
      most_in_demand: product.most_in_demand ?? false,
      is_eid_special: product.is_eid_special ?? false,
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm || editingProductId == null) return;
    const price = parseFloat(editForm.price);
    if (!editForm.name || isNaN(price)) return;
    setSaving(true);
    await supabase.from('products').update({
      name: editForm.name,
      description: editForm.description || null,
      price,
      category: editForm.category,
      image: editForm.image || DEFAULT_IMAGE_FOR[editForm.category] || IMAGES.biscuits,
      unit: editForm.unit || null,
      popular: editForm.popular,
      most_in_demand: editForm.most_in_demand,
      is_eid_special: editForm.is_eid_special,
    }).eq('id', editingProductId);
    setEditingProductId(null);
    setEditForm(null);
    await fetchProducts();
    setSaving(false);
    flash();
  };

  // ── DELETE PRODUCT ────────────────────────
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
  };

  // ── ADD PRODUCT ───────────────────────────
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProduct.price as any);
    if (!newProduct.name || isNaN(price)) return;
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    setSaving(true);
    await supabase.from('products').insert({
      id: maxId + 1,
      name: newProduct.name,
      description: newProduct.description || null,
      price,
      category: newProduct.category,
      image: newProduct.image || DEFAULT_IMAGE_FOR[newProduct.category] || IMAGES.biscuits,
      unit: newProduct.unit || null,
      popular: newProduct.popular,
      most_in_demand: newProduct.most_in_demand,
      is_eid_special: newProduct.is_eid_special,
      sort_order: products.filter(p => p.category === newProduct.category).length + 1,
    });
    setNewProduct({ ...BLANK_PRODUCT });
    await fetchProducts();
    setSaving(false);
    flash();
    setActiveTab('products');
  };

  const filteredProducts = products.filter(p => {
    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // ── LOGIN SCREEN ──────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <span className="text-[9px] tracking-[0.5em] text-gold-600 uppercase font-light">Restricted</span>
            <h1 className="text-3xl font-serif text-white font-light mt-4 tracking-wide">Admin Portal</h1>
            <div className="w-10 h-px bg-gold-500/40 mx-auto mt-6" />
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
            {loginError && <p className="text-red-500 text-xs font-light tracking-wider">{loginError}</p>}
            <button type="submit" className="w-full bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase py-4 rounded-full hover:bg-gold-500 transition-all duration-500 mt-4">Sign In</button>
          </form>
          <p className="text-center mt-8"><a href="/" className="text-zinc-500 text-xs tracking-widest hover:text-white transition-colors">← Back to Store</a></p>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <span className="text-[9px] tracking-[0.5em] text-gold-600 uppercase font-light">@Admin</span>
          <h1 className="text-xl font-serif font-light tracking-wide">Pastry Corner — Dashboard</h1>
        </div>
        <div className="flex items-center gap-6">
          {saving && <span className="text-[10px] tracking-widest text-zinc-400 uppercase animate-pulse">Saving…</span>}
          {saved && <span className="text-[10px] tracking-widest text-emerald-400 uppercase">Saved ✓</span>}
          <a href="/" className="text-[10px] tracking-widest text-zinc-400 hover:text-gold-500 uppercase transition-colors">View Store →</a>
          <button onClick={() => setAuthed(false)} className="text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase transition-colors">Log Out</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-10">
          {([['prices', 'Menu Prices'], ['discounts', 'Discounts'], ['products', 'All Products'], ['add', '+ Add New Product']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] tracking-[0.3em] uppercase transition-all ${activeTab === tab ? 'text-white border-b-2 border-gold-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        {(activeTab === 'prices' || activeTab === 'discounts' || activeTab === 'products') && (
          <div className="flex flex-wrap gap-4 mb-6">
            {[{ id: 'all', name: 'All' }, ...CATEGORIES].map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`text-[10px] tracking-[0.25em] uppercase px-5 py-2 rounded-full border transition-all ${selectedCategory === cat.id ? 'bg-gold-600 text-black border-gold-600' : 'border-white/10 text-zinc-400 hover:border-gold-600/50 hover:text-white'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        {(activeTab === 'prices' || activeTab === 'discounts' || activeTab === 'products') && (
          <div className="max-w-md mb-10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: MENU PRICES ── */}
        {activeTab === 'prices' && (
          <>
            {loading ? <p className="text-center text-zinc-500 text-xs tracking-widest uppercase py-20 animate-pulse">Loading…</p> : (
              <>
                <div className="space-y-3">
                  {filteredProducts.map(product => {
                    const displayPrice = priceEdits[product.id] ?? String(product.price);
                    const hasDiscount = product.original_price != null;
                    return (
                      <div key={product.id}
                        className={`flex items-center gap-6 px-6 py-5 rounded-2xl border transition-all ${hasDiscount ? 'border-gold-600/40 bg-zinc-900/60' : 'border-white/5 bg-zinc-900/30 hover:border-white/10'}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-light">{product.name}</p>
                          <p className="text-[10px] text-zinc-500 tracking-widest uppercase">{product.category}</p>
                        </div>
                        {hasDiscount && (
                          <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 uppercase tracking-wider font-medium">Discounted</span>
                        )}
                        {hasDiscount && (
                          <span className="text-xs text-zinc-500 line-through">Rs. {product.original_price}</span>
                        )}
                        <div className="relative w-36">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">Rs.</span>
                          <input type="number" min="0" step="0.01" value={displayPrice}
                            onChange={e => setPriceEdits(prev => ({ ...prev, [product.id]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-gold-500 focus:outline-none transition-colors" />
                        </div>
                        {hasDiscount && (
                          <button onClick={() => handleResetPrice(product.id)}
                            className="text-[9px] tracking-widest uppercase text-zinc-500 hover:text-red-400 transition-colors whitespace-nowrap">
                            Reset
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={handleSavePrices} disabled={saving || Object.keys(priceEdits).length === 0}
                    className="bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase px-10 py-4 rounded-full hover:bg-gold-500 disabled:opacity-40 transition-all">
                    {saving ? 'Saving…' : 'Save Price Changes'}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── TAB: DISCOUNTS ── */}
        {activeTab === 'discounts' && (
          <>
            {/* Bulk / Category Discount */}
            <div className="mb-8 bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
              <h2 className="text-lg font-serif font-light mb-1">Bulk Discount</h2>
              <p className="text-zinc-500 text-xs font-light mb-6 tracking-wider">Apply a % discount to a category or all products. Old price will show as strikethrough on the store.</p>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="relative max-w-xs flex-1 min-w-[140px]">
                  <input type="number" min="1" max="99" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} placeholder="Discount %"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light focus:border-gold-500 focus:outline-none transition-colors placeholder:text-zinc-600" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
                </div>
                <button onClick={handleCategoryDiscount} disabled={saving}
                  className="bg-gold-600 text-black text-[11px] tracking-[0.25em] font-medium uppercase px-8 py-4 rounded-full hover:bg-gold-500 disabled:opacity-60 transition-all">
                  Apply to {selectedCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </button>
                <button onClick={handleResetAllDiscounts} disabled={saving}
                  className="text-[10px] tracking-widest uppercase text-zinc-500 hover:text-red-400 transition-colors border border-white/10 rounded-full px-5 py-4">
                  Reset All Discounts
                </button>
              </div>
            </div>

            {/* Selected Product Discount */}
            <div className="mb-8 bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
              <h2 className="text-lg font-serif font-light mb-1">Selected Product Discount</h2>
              <p className="text-zinc-500 text-xs font-light mb-6 tracking-wider">Pick specific products and apply a discount only to them.</p>
              <div className="flex gap-4 items-center mb-6 flex-wrap">
                <div className="relative max-w-xs flex-1 min-w-[140px]">
                  <input type="number" min="1" max="99" value={productDiscountPercent} onChange={e => setProductDiscountPercent(e.target.value)} placeholder="Discount %"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light focus:border-gold-500 focus:outline-none transition-colors placeholder:text-zinc-600" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
                </div>
                <button onClick={handleSelectedProductDiscount} disabled={saving || selectedForDiscount.size === 0}
                  className="bg-gold-600 text-black text-[11px] tracking-[0.25em] font-medium uppercase px-8 py-4 rounded-full hover:bg-gold-500 disabled:opacity-60 transition-all">
                  Apply to {selectedForDiscount.size} Selected
                </button>
                {selectedForDiscount.size > 0 && (
                  <button onClick={() => setSelectedForDiscount(new Set())}
                    className="text-[10px] tracking-widest uppercase text-zinc-500 hover:text-red-400 transition-colors border border-white/10 rounded-full px-5 py-4">
                    Clear Selection
                  </button>
                )}
              </div>
              {loading ? <p className="text-center text-zinc-500 text-xs tracking-widest uppercase py-10 animate-pulse">Loading…</p> : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredProducts.map(product => {
                    const isSelected = selectedForDiscount.has(product.id);
                    const hasDiscount = product.original_price != null;
                    return (
                      <div key={product.id}
                        onClick={() => toggleProductSelection(product.id)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-gold-500 bg-gold-500/10' : 'border-white/5 bg-zinc-900/30 hover:border-white/10'}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'border-gold-500 bg-gold-500' : 'border-zinc-600'}`}>
                          {isSelected && <span className="text-black text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-light">{product.name}</p>
                          <p className="text-[10px] text-zinc-500 tracking-widest uppercase">{product.category}</p>
                        </div>
                        {hasDiscount && (
                          <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 uppercase tracking-wider font-medium">Discounted</span>
                        )}
                        {hasDiscount && (
                          <span className="text-xs text-zinc-500 line-through">Rs. {product.original_price}</span>
                        )}
                        <span className="text-sm text-gold-500">Rs. {product.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB: ALL PRODUCTS ── */}
        {activeTab === 'products' && (
          loading ? <p className="text-center text-zinc-500 text-xs tracking-widest uppercase py-20 animate-pulse">Loading…</p> : (
            <div className="space-y-3">
              {filteredProducts.map(product => {
                const isEditing = editingProductId === product.id;
                const hasDiscount = product.original_price != null;

                if (isEditing && editForm) {
                  return (
                    <div key={product.id} className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-serif text-gold-500 tracking-wider uppercase">Edit Product</h3>
                        <button onClick={() => { setEditingProductId(null); setEditForm(null); }}
                          className="text-[9px] tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Cancel</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="Product Name"
                          className="col-span-2 bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
                        <input type="number" value={editForm.price} onChange={e => setEditForm((f: any) => ({ ...f, price: e.target.value }))} placeholder="Price (Rs.)"
                          className="bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
                        <select value={editForm.category} onChange={e => setEditForm((f: any) => ({ ...f, category: e.target.value }))}
                          className="bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light focus:border-gold-500 focus:outline-none transition-colors">
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <textarea value={editForm.description} onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={2}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors resize-none" />
                      
                      {/* Google Drive Link Converter */}
                      <div className="bg-zinc-950/60 border border-gold-500/20 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-3 h-3 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-[9px] tracking-widest uppercase text-gold-500 font-medium">Google Drive Link Converter</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Paste Google Drive sharing link..."
                            value={gdriveLinkInput}
                            onChange={e => setGdriveLinkInput(e.target.value)}
                            className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const converted = convertGDriveLink(gdriveLinkInput);
                              setConvertedLink(converted);
                              setEditForm((f: any) => ({ ...f, image: converted }));
                            }}
                            className="bg-gold-600 text-black text-[8px] tracking-widest uppercase px-3 py-1.5 rounded-lg hover:bg-gold-500 transition-colors font-medium"
                          >
                            Convert
                          </button>
                        </div>
                        {convertedLink && (
                          <div className="bg-zinc-900 border border-green-500/30 rounded-lg p-2 space-y-1">
                            <p className="text-[8px] tracking-wider uppercase text-green-400">✓ Converted</p>
                            <p className="text-[10px] text-zinc-300 break-all font-mono">{convertedLink}</p>
                          </div>
                        )}
                      </div>

                      <input value={editForm.image} onChange={e => setEditForm((f: any) => ({ ...f, image: e.target.value }))} placeholder="Image URL (paste converted link)"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
                      <input value={editForm.unit} onChange={e => setEditForm((f: any) => ({ ...f, unit: e.target.value }))} placeholder="Unit (e.g. per kg, piece)"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-3 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
                      <div className="flex gap-6 flex-wrap">
                        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={editForm.popular} onChange={e => setEditForm((f: any) => ({ ...f, popular: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                          Signature
                        </label>
                        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={editForm.most_in_demand} onChange={e => setEditForm((f: any) => ({ ...f, most_in_demand: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                          Most in Demand
                        </label>
                        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={editForm.is_eid_special} onChange={e => setEditForm((f: any) => ({ ...f, is_eid_special: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                          Eid Special
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={handleSaveEdit} disabled={saving}
                          className="bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase px-8 py-3 rounded-full hover:bg-gold-500 disabled:opacity-60 transition-all">
                          {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={product.id}
                    className="flex items-center gap-6 px-6 py-4 rounded-2xl border border-white/5 bg-zinc-900/30 hover:border-white/10 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-light">{product.name}</p>
                      <p className="text-[10px] text-zinc-500 tracking-widest uppercase">{product.category} {product.unit ? `· ${product.unit}` : ''}</p>
                    </div>
                    {hasDiscount && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 uppercase tracking-wider font-medium">Discounted</span>
                    )}
                    {hasDiscount && (
                      <span className="text-xs text-zinc-500 line-through">Rs. {product.original_price}</span>
                    )}
                    <span className="text-sm text-gold-500">Rs. {product.price}</span>
                    {product.popular && <span className="text-[9px] text-zinc-400 border border-white/10 rounded-full px-3 py-1 uppercase tracking-wider">Signature</span>}
                    {product.most_in_demand && <span className="text-[9px] text-orange-400 border border-orange-500/30 rounded-full px-3 py-1 uppercase tracking-wider">In Demand</span>}
                    {product.is_eid_special && <span className="text-[9px] text-gold-500 border border-gold-600/30 rounded-full px-3 py-1 uppercase tracking-wider">Eid</span>}
                    <button onClick={() => startEditing(product)}
                      className="text-[9px] tracking-widest uppercase text-zinc-400 hover:text-gold-500 transition-colors whitespace-nowrap">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}
                      className="text-[9px] tracking-widest uppercase text-zinc-600 hover:text-red-500 transition-colors whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── TAB: ADD PRODUCT ── */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddProduct} className="max-w-2xl space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <input required placeholder="Product Name *" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                className="col-span-2 bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
              <input required type="number" placeholder="Price (Rs.) *" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                className="bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
              <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                className="bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light focus:border-gold-500 focus:outline-none transition-colors">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors resize-none" />
            
            {/* Google Drive Link Converter */}
            <div className="bg-zinc-900/40 border border-gold-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-[10px] tracking-widest uppercase text-gold-500 font-medium">Google Drive Link Converter</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Paste Google Drive sharing link here..."
                  value={gdriveLinkInput}
                  onChange={e => setGdriveLinkInput(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    const converted = convertGDriveLink(gdriveLinkInput);
                    setConvertedLink(converted);
                    setNewProduct(p => ({ ...p, image: converted }));
                  }}
                  className="bg-gold-600 text-black text-[9px] tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-gold-500 transition-colors font-medium"
                >
                  Convert
                </button>
              </div>
              {convertedLink && (
                <div className="bg-zinc-950 border border-green-500/30 rounded-lg p-3 space-y-2">
                  <p className="text-[9px] tracking-wider uppercase text-green-400">✓ Converted Link:</p>
                  <p className="text-xs text-zinc-300 break-all font-mono">{convertedLink}</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(convertedLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="text-[9px] tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>

            <input placeholder="Image URL (paste converted link or any direct image URL)" value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
            <input placeholder="Unit (e.g. per kg, piece, 100g)" value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))}
              className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-light placeholder:text-zinc-500 focus:border-gold-500 focus:outline-none transition-colors" />
            <div className="flex gap-8 flex-wrap">
              <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={newProduct.popular} onChange={e => setNewProduct(p => ({ ...p, popular: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                Mark as Signature
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={newProduct.most_in_demand} onChange={e => setNewProduct(p => ({ ...p, most_in_demand: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                Most in Demand
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={newProduct.is_eid_special} onChange={e => setNewProduct(p => ({ ...p, is_eid_special: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                Eid Special
              </label>
            </div>
            <button type="submit" disabled={saving}
              className="bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase px-10 py-4 rounded-full hover:bg-gold-500 disabled:opacity-60 transition-all">
              {saving ? 'Saving…' : 'Add Product to Store'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
