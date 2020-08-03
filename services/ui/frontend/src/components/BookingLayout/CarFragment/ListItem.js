import React from "react";
import { useActions } from "redux/actions";
import { useSelector } from "react-redux";

import Badge from "@material-ui/core/Badge";
import AddShoppingCartRoundedIcon from "@material-ui/icons/AddShoppingCartRounded";
import RemoveShoppingCartRoundedIcon from "@material-ui/icons/RemoveShoppingCartRounded";

import styles from "./CarFragment.module.css";

import priceConversion from "components/common/convert-currency";
import useExchangeRates from "api/use-exchange-rate";

function ListItem({ id, rental_company, name, cost, image }) {
  const currency = useSelector((state) => state.carFilters.currency);
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
          background: `transparent url(${image}) no-repeat 0 0 / cover`,
        }}
      />

      <div className={styles.listItemContent}>
        <div className={styles.listItemTitle}>{name}</div>
        <div className={styles.listItemSub}>{rental_company}</div>
        <div className={styles.listItemCost}>{priceString}</div>
      </div>
      <button
        style={{
          outline: "none",
          borderRadius: "8px",
          marginLeft: "auto",
          border: "none",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
        onClick={handleAddToCart}
      >
        <Badge badgeContent={numberInCart} color="primary">
          <AddShoppingCartRoundedIcon color="primary" />
        </Badge>
      </button>
      {numberInCart > 0 && (
        <button
          className={styles.buttonstyle}
          style={{
            outline: "none",
            borderRadius: "8px",
            border: "none",
            paddingLeft: "24px",
            paddingRight: "24px",
            marginLeft: "16px",
          }}
          onClick={handleRemoveFromCart}
        >
          <RemoveShoppingCartRoundedIcon color="secondary" />
        </button>
      )}
    </div>
  );
}

export default ListItem;
