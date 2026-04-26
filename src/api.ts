import type { Customer, Training } from "./types";

const BASE_URL = "http://localhost:8080/api";

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`);
  const data = await res.json();
  return data._embedded?.customers || [];
};

export const getTrainings = async (): Promise<Training[]> => {
  const res = await fetch(`${BASE_URL}/trainings`);
  const data = await res.json();
  return data._embedded?.trainings || [];
};