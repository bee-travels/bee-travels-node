import React from "react";

import useHotels from "api/use-hotels";

import ListItem from "./ListItem";
import MetaData from "./MetaData";
import Filters from "./Filters";

const BookingFragment = () => {
  const { data: hotels = [] } = useHotels();

  return (
    <>
      <MetaData />
      <Filters />

      {hotels.map((props) => {
        return <ListItem key={props.id} {...props} />;
      })}
    </>
  );
};

export default BookingFragment;
