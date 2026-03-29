import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';

function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    image: row.image,
    unit: row.unit ?? undefined,
    popular: row.popular ?? false,
    mostInDemand: row.most_in_demand ?? false,
    isEidSpecial: row.is_eid_special ?? false,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch products:', error.message);
      return;
    }
    setProducts((data || []).map(mapRow));
    setLoading(false);
  };

  useEffect(() => {
    fetch();

    // Real-time subscription — price/product changes reflect for all users instantly
    const channel = supabase
      .channel('product_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { products, loading };
}
