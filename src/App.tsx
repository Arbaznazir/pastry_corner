import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import OrderForm from "./components/OrderForm";
import RecentOrders from "./components/RecentOrders";
import CustomOrderModal from "./components/CustomOrderModal";
import type { CartItem, Product, Order } from "./types";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isRecentOrdersOpen, setIsRecentOrdersOpen] = useState(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500/20 selection:text-white overflow-x-hidden">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsRecentOrdersOpen(true)}
        onCustomOrderClick={() => setIsCustomOrderOpen(true)}
      />

      <main className="pt-16 md:pt-20 pb-24 relative">
        <Hero />
        <ProductGrid onAddToCart={addToCart} />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        total={getTotalPrice()}
        onCheckout={handleCheckout}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        cart={cart}
        total={getTotalPrice()}
        onPlaceOrder={(order) => {
          setOrders(prev => [order, ...prev]);
          setCart([]);
        }}
      />

      <RecentOrders 
        isOpen={isRecentOrdersOpen}
        onClose={() => setIsRecentOrdersOpen(false)}
        orders={orders}
      />

      <CustomOrderModal 
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
      />
    </div>
  );
}

export default App;
