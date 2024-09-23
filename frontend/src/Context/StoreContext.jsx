import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list, menu_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  //const url = "http://localhost:3000";
  const url = "https://mealdash-backend.onrender.com";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [promoCode, setPromoCode] = useState(""); // State for promo code
  const [discount, setDiscount] = useState(0); // State for discount value
  const currency = "₹";
  const deliveryCharge = 40;

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          totalAmount += itemInfo.price * cartItems[item];
        }
      } catch (error) {
        console.error("Error calculating total amount", error);
      }
    }
    return parseFloat(totalAmount.toFixed(2)); // Round to 2 decimal places and convert back to number
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: token }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData({ token: localStorage.getItem("token") });
      }
    }
    loadData();
  }, []);

  // Promo code logic
  const applyPromoCode = (code) => {
    const promoCodes = {
      TASTY40: 0.4, // 40% discount
      // Add more promo codes here as needed
    };

    if (promoCodes[code]) {
      setPromoCode(code);
      setDiscount(promoCodes[code]);
      return promoCodes[code]; // Return the discount
    } else {
      setPromoCode("");
      setDiscount(0);
      return null; // Return null for invalid codes
    }
  };

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
    promoCode, // Expose promo code
    discount, // Expose discount
    setDiscount, // Expose setDiscount to allow updating discount state
    applyPromoCode, // Expose function to apply promo code
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
