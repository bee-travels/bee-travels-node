import React from "react";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";

import {useItems} from "api/use-item";

import styles from "./CheckoutLayout.module.css";

function buildItems(cars, hotels, flights) {
  let res = {};

  cars.forEach((item) => {
    
    if (res[`${item.id}_${item.dateFrom}_${item.dateTo}`]) {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: res[`${item.id}_${item.dateFrom}_${item.dateTo}`].count + 1,
        type: "cars"
      };
    } else {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: 1,
        type: "cars"
      };
    }
  });

  hotels.forEach((item) => {
    if (res[`${item.id}_${item.dateFrom}_${item.dateTo}`]) {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: res[`${item.id}_${item.dateFrom}_${item.dateTo}`].count + 1,
        type: "hotels"
      };
    } else {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: 1,
        type: "hotels"
      };
    }
  });

  flights.forEach((item) => {
    if (res[`${item.id}_${item.dateFrom}_${item.dateTo}`]) {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: res[`${item.id}_${item.dateFrom}_${item.dateTo}`].count + 1,
        type: "flights"
      };
    } else {
      res[`${item.id}_${item.dateFrom}_${item.dateTo}`] = {
        item: item,
        count: 1,
        type: "flights"
      };
    }
  });



  return Object.keys(res).map((key) => res[key]);
}

function getTotal(data) {
  let total = 0;

  for(var i = 0; i<data.length; i++) {
    let days = (data[i].dateTo - data[i].dateFrom)/(1000*60*60*24);
    total += days * data[i].cost;
  }
  return total;
}

const Checkout = () => {
  const _cars = useSelector((state) => state.cars);
  const _hotels = useSelector((state) => state.hotels);
  const _flights = [];

  const items = buildItems(_cars, _hotels, _flights);

  const {data: val = []} = useItems(items);

  return (
    <div className={styles.container}>
      {/* {cars.map((car)=> <li>{car.id}</li>)}
      {hotels.map((hotel)=> <li>{hotel.id}</li>)} */}
      <div className={styles.billing}>
        Billing
        <div className={styles.info}>
          <p>John Doe</p>
          <p>123 Main St.</p>
          <p>Springfield, AA 19823, USA</p>
        </div>
      </div>
      <div className={styles.payment}>
        Payment
        <TextField
          id="Name"
          placeholder="Name on Card"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="Name"
          placeholder="Card Number"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="Name"
          placeholder="mm/yy"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="Name"
          placeholder="CVC"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </div>
      <div className={styles.review}>Review</div>
      {val.map((d) => {
        return <div key={d.id}> <p>{d.name}</p> </div>
      })}
      <div className={styles.orderSummary}>
        Order Summary
        <div>Items
          <div>${getTotal(val)}</div>
        </div>
        <div>Total</div>
      </div>
      <div className={styles.placeOrder}>Place Order</div>
    </div>
  );
};

export default Checkout;
