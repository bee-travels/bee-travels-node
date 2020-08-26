import React from "react";

import ListItem from "./ListItem";
import MetaData from "./MetaData";
import Filters from "./Filters";
import useCars from "api/use-cars";

const BookingFragment = () => {
  const { data: cars = [] } = useCars();
  return (
    <>
      <MetaData />
      <Filters />

      {cars.map((props) => {
        return <ListItem key={props.id} {...props} />;
      })}
    </>
  );
};

export default BookingFragment;
