import React from "react"
import { useActions } from "redux/actions";
import { useSelector } from "react-redux";

import styles from "./HotelFragment.module.css";
import priceConversion from "components/common/convert-currency";
import useExchangeRates from "api/use-exchange-rate";

function ListItem({ id, superchain, name, cost, images }) {
  const currency = useSelector((state) => state.hotelFilters.currency);
  const { exchangeRates } = useExchangeRates();
  const { addHotelsToCart, removeHotelsFromCart } = useActions();
  const hotels = useSelector((state) => state.hotels);
  const numberInCart = hotels.filter((hotelId) => hotelId === id).length;
  const handleAddToCart = () => {
    addHotelsToCart(id);
  };
  const handleRemoveFromCart = () => {
    removeHotelsFromCart(id);
  };

  const priceString = priceConversion(cost, {
    from: exchangeRates.USD,
    to: exchangeRates[currency],
  }).toLocaleString(undefined, {
    style: "currency",
    currency: currency,
  });

  return (
    <div className={styles.listItem}>
      <div
        className={styles.listItemImage}
        style={{
          background: `transparent url(${images[0]}) no-repeat 0 0 / cover`,
        }}
      />

      <div className={styles.listItemContent}>
        <div className={styles.listItemTitle}>{name}</div>
        <div className={styles.listItemSub}>{superchain}</div>
        <div className={styles.listItemCost}>{priceString}</div>
      </div>
      <button style={{ marginLeft: "auto" }} onClick={handleAddToCart}>
        Add to Cart
      </button>
      {numberInCart > 0 && (
        <button onClick={handleRemoveFromCart}>Remove </button>
      )}
      {numberInCart}
    </div>
  );
}

export default ListItem;
