import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

/**
 * Cart holds items for AT MOST ONE farmer at a time (mirrors the
 * backend: an order is always against a single farmer's stock/pickup
 * slot). Adding a product from a different farmer prompts a clear
 * replace-cart confirmation in the UI rather than silently merging.
 */
export function CartProvider({ children }) {
  const [farmerId, setFarmerId] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [items, setItems] = useState([]); // { productId, name, price, unit, quantity, maxAvailable, imageUrl }

  function addItem(product, quantity = 1) {
    if (farmerId && farmerId !== product.farmerId) {
      throw new Error("DIFFERENT_FARMER");
    }
    setFarmerId(product.farmerId);
    setFarmerName(product.farmerName);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.maxAvailable) }
            : i
        );
      }
      return [...prev, { ...product, quantity: Math.min(quantity, product.maxAvailable) }];
    });
  }

  function replaceCartWith(product, quantity = 1) {
    setFarmerId(product.farmerId);
    setFarmerName(product.farmerName);
    setItems([{ ...product, quantity: Math.min(quantity, product.maxAvailable) }]);
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxAvailable)) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      if (next.length === 0) {
        setFarmerId(null);
        setFarmerName("");
      }
      return next;
    });
  }

  function clearCart() {
    setItems([]);
    setFarmerId(null);
    setFarmerName("");
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ farmerId, farmerName, items, total, addItem, replaceCartWith, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
