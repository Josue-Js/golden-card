import { useState, useEffect, createContext, ReactNode } from "react";
import Cookies from 'js-cookie';

type ICartContextData = {
  cart: ICart;
  lenCart: number;
  addCart: (product: IProduct) => void;
  removeCart: (product: IProduct) => void;
  clearCart: () => void;
}

export const CartContext = createContext({} as ICartContextData);

type Props = {
  children: ReactNode
}

type IProduct = {
  product_id: string;
  price_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  rating: number;
}



type ICart = {
  items: Array<{
    product: IProduct,
    quantity: number
  }>
  priceTotal: string;
}


export function CartProvider({ children }: Props) {

  const [cart, setCart] = useState<ICart>({ items: [], priceTotal: '0' });
  const lenCart = cart.items.length;


  useEffect(() => {

    const cookies = Cookies.get('cart');

    if (cookies != undefined) {
      setCart(JSON.parse(atob(cookies)))
    }
  }, [])


  useEffect(() => {
    Cookies.set('cart', btoa(JSON.stringify(cart)), { secure: true });
  }, [cart])


  function addCart(product: IProduct) {

    const indexProductInCart = cart.items.findIndex(item => item.product.product_id === product.product_id);
    const isProductIsInTheCart = indexProductInCart != -1;

    const updateCart = cart;

    if (isProductIsInTheCart) {

      updateCart.items[indexProductInCart].quantity += 1

      const sumPriceTotal = updateCart.items
        .reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);


      setCart({
        items: updateCart.items,
        priceTotal: String(sumPriceTotal)
      });


    } else {

      const addNewItemInCart = { product, quantity: 1 };
      updateCart.items.push(addNewItemInCart);

      const sumPriceTotal = updateCart.items.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);

      setCart({
        items: updateCart.items,
        priceTotal: String(sumPriceTotal)
      });
    }
  }

  function removeCart(product: IProduct) {

    const indexProductInCart = cart.items.findIndex(item => item.product.product_id === product.product_id);
    const productIsInTheCart = indexProductInCart != -1;

    const updateCart = cart

    if (productIsInTheCart) {

      const product = updateCart.items[indexProductInCart]

      if (product.quantity == 1) {
        updateCart.items.splice(indexProductInCart, 1)
      } else {
        product.quantity -= 1
      }

      var sumPriceTotal = 0;
      if (updateCart.items.length != 0) {

        sumPriceTotal = updateCart.items
          .reduce((total, item) => total + parseInt(item.product.price) * item.quantity, 0);
      }


      setCart({
        items: updateCart.items,
        priceTotal: String(sumPriceTotal)
      });
    }
  }

  function clearCart() {

    Cookies.remove('cart')
    setCart({
      items: [],
      priceTotal: '0'
    })
  }



  return (
    <CartContext.Provider value={{
      cart,
      lenCart,
      addCart,
      removeCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}