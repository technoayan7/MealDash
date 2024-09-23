import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
    deliveryCharge,
    discount, // Access discount from context
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    // Calculate discounted total amount
    let totalAmount = getTotalCartAmount() + deliveryCharge;
    totalAmount = totalAmount * (1 - discount);
    totalAmount =
      payment === "cod"
        ? Math.round(totalAmount)
        : parseFloat(totalAmount.toFixed(2));

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
    };

    if (payment === "stripe") {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error("Something Went Wrong");
      }
    } else {
      let response = await axios.post(url + "/api/order/placecod", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        navigate("/myorders");
        toast.success(response.data.message);
        setCartItems({});
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("To place an order, sign in first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email address"
            required
          />
          <input
            type="text"
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            placeholder="Phone"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            placeholder="Street"
            required
          />
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip code"
            required
          />
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {currency}
                {getTotalCartAmount() === 0 ? 0 : deliveryCharge}
              </p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>
                    - {currency}
                    {(getTotalCartAmount() * discount).toFixed(2)}{" "}
                    {/* Show discount */}
                  </p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {
                  getTotalCartAmount() === 0
                    ? 0
                    : payment === "cod"
                    ? Math.round(
                        (getTotalCartAmount() + deliveryCharge) * (1 - discount)
                      ) // Round to whole number for COD
                    : parseFloat(
                        (
                          (getTotalCartAmount() + deliveryCharge) *
                          (1 - discount)
                        ).toFixed(2)
                      ) // Two decimal places for other payments
                }
              </b>
            </div>
          </div>
        </div>
        <div className="payment">
          <h2 className="h2e">Payment Method</h2>
          <div onClick={() => setPayment("cod")} className="payment-option">
            <img
              src={payment === "cod" ? assets.checked : assets.un_checked}
              alt=""
            />
            <p className="p2e">COD ( Cash on delivery )</p>
          </div>
          <div onClick={() => setPayment("stripe")} className="payment-option">
            <img
              src={payment === "stripe" ? assets.checked : assets.un_checked}
              alt=""
            />
            <p className="p2e">Stripe ( Credit / Debit )</p>
          </div>
        </div>
        <button className="place-order-submit" type="submit">
          {payment === "cod" ? "Place Order" : "Proceed To Payment"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
