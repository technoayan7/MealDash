import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    applyPromoCode,
    discount,
    setDiscount,
  } = useContext(StoreContext);

  const [promoInput, setPromoInput] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const totalAmount = getTotalCartAmount();
    setSubtotal(totalAmount);
    recalculateTotal(totalAmount, discount);
  }, [discount, cartItems]);


  const formatCurrency = (value) => {
    return `${currency}${value.toFixed(2)}`;
  };

  const recalculateTotal = (subtotalAmount, discountValue) => {
    const newTotal =
      (subtotalAmount +
      (subtotalAmount > 0 ? deliveryCharge : 0)) * (1 - discountValue);

    setFinalTotal(parseFloat(newTotal.toFixed(2))); // Convert back to number
  };


  const handlePromoSubmit = () => {
    if (getTotalCartAmount() === 0) {
      toast.error(
        "Your cart is empty. Add items before applying a promo code."
      );
      return;
    }

    const result = applyPromoCode(promoInput);
    if (result) {
      setIsPromoApplied(true);
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code.");
    }
  };

  const handleRemovePromoCode = () => {
    setPromoInput("");
    setDiscount(0);
    setIsPromoApplied(false);
    recalculateTotal(subtotal, 0);
    toast.info("Promo code removed.");
  };

  

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="headings cart-items-title">
          <p id="head1">Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <br />
        <hr />
        {food_list.length > 0 ? (
          food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              const totalItemPrice = item.price * cartItems[item._id];
              return (
                <div key={index}>
                  <div className="cart-items-title cart-items-item">
                    <img id="logo" src={`${url}/images/${item.image}`} alt={item.name} />
                    <p>{item.name}</p>
                    <p>{formatCurrency(item.price)}</p>
                    <div className="quantity-controls">
                      <img
                        className="remove-icon"
                        onClick={() => removeFromCart(item._id)}
                        src={assets.remove_icon_red}
                        alt="Remove"
                      />
                      <span>{cartItems[item._id]}</span>
                      <img
                        className="add-icon"
                        onClick={() => addToCart(item._id)}
                        src={assets.add_icon_green}
                        alt="Add"
                      />
                    </div>
                    <p>{formatCurrency(totalItemPrice)}</p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{formatCurrency(subtotal === 0 ? 0 : deliveryCharge)}</p>
            </div>
            <hr />
            {isPromoApplied && (
              <>
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>- {formatCurrency(subtotal * discount)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>{formatCurrency(finalTotal)}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="TRY -> 'TASTY40' "
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePromoSubmit();
                  }
                }}
              />
              {isPromoApplied ? (
                <button onClick={handleRemovePromoCode}>Remove</button>
              ) : (
                <button onClick={handlePromoSubmit}>Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
