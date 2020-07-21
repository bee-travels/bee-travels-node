export default function init() {
  let cars = localStorage.getItem('cars');
  if(cars) {
    cars = JSON.parse(cars);
  }
  let hotels = localStorage.getItem('hotels');
  if(hotels) {
    hotels = JSON.parse(hotels);
  }

  let flights = localStorage.getItem('flights');
  if (flights) {
    flights = JSON.parse(flights);
  }
  return {
    hotels: hotels || [],
    cars: cars || [],
    flights: flights || [],
  }
}