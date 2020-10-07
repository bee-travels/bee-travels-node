import React from "react";
import { useActions } from "redux/actions";
import { useSelector } from "react-redux";

import Badge from "@material-ui/core/Badge";
import AddShoppingCartRoundedIcon from "@material-ui/icons/AddShoppingCartRounded";
import RemoveShoppingCartRoundedIcon from "@material-ui/icons/RemoveShoppingCartRounded";

import styles from "./HotelFragment.module.css";
import priceConversion from "components/common/convert-currency";
import useExchangeRates from "api/use-exchange-rate";

function ListItem({ id, superchain, name, cost, images }) {
  const currency = useSelector((state) => state.hotelFilters.currency);
  const dateFrom = useSelector((state) => state.hotelFilters.dateFrom);
  const dateTo = useSelector((state) => state.hotelFilters.dateTo);
  const { exchangeRates } = useExchangeRates();
  const { addHotelsToCart, removeHotelsFromCart } = useActions();
  const hotels = useSelector((state) => state.hotels);
  //[{"id":"a33f794d-9631-4f22-bb2e-38bd98ef4b42","dateFrom":"2020-10-07","dateTo":"2020-10-22"},{"id":"a33f794d-9631-4f22-bb2e-38bd98ef4b42","dateFrom":"2020-10-07","dateTo":"2020-10-22"}]
  // ["", ""]
  const numberInCart = hotels.filter((d) => d.id === id).length;
  const handleAddToCart = () => {
    addHotelsToCart({id, dateFrom, dateTo});
  };
  const handleRemoveFromCart = () => {
    removeHotelsFromCart({id, dateFrom, dateTo});
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
