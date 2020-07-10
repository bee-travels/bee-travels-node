export default function init() {
  let cars = localStorage.getItem('cars');
  if(cars) {
    cars = JSON.parse(cars);
  }
  return {
    hotels: [],
    cars: cars || [],
    flights: [],
  }
}