import React, { createContext, useContext, useState } from "react";


export const AppContext = createContext(null)

export default function AppProvider({children}){
    const [product,setProduct] = useState(null)
    const [cartData,setCartData] = useState(null)
    const [cartProductId,setCartProductId] = useState([])
    const [productCount,setProductCount] = useState(0)
    const [totalCartPrice,setTotalCartPrice] = useState(0)
    
    return(
        <AppContext.Provider
        value={{
            product,
            setProduct,
            cartData,
            setCartData,
            cartProductId,
            setCartProductId,
            productCount,
            setProductCount,
            totalCartPrice,
            setTotalCartPrice
        }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const AppState = ()=>{
    return useContext(AppContext)
}