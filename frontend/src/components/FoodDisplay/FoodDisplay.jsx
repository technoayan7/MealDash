import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display">
      <h2 className="h2we">Top dishes near you</h2>
      <div className="food-display-list">
        {food_list
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the order of items
          .map((item) => {
            if (category === "All" || category === item.category) {
              return (
                <FoodItem
                  key={item._id} // Use item._id as the key
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null; // Return null if category does not match
          })}
      </div>
    </div>
  );
};

export default FoodDisplay;
