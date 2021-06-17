export interface FoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

export interface FoodFormatted extends FoodData {
  id: number;
  available: boolean;
}