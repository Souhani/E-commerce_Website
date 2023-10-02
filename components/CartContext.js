import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const [cartProducts,setCartProducts] = useState([]);
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    useEffect(()=> {
        if(ls && ls.getItem('cart')){
            setCartProducts(JSON.parse(localStorage.getItem('cart')))
        }
    },[])
    useEffect(() => {
        if(cartProducts?.length > 0){
            localStorage.setItem('cart', JSON.stringify(cartProducts))
        }else if(cartProducts?.length == 0){
            localStorage.removeItem('cart')
        }
    }, [cartProducts])
    function addProductToCart(productId){
        setCartProducts(prev => [...prev, productId]);
      }

    function removeProductFromCart(productId) {
        setCartProducts((prev) => {
            const position = prev.indexOf(productId);       
            if (position !== -1) {
            return prev.filter((value, index) => index !== position);
            }else{
            return prev;
        }});
    };

    function clearCart() {
        setCartProducts([]);
    }
    return(
        <CartContext.Provider value={{cartProducts, addProductToCart, removeProductFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    )
}