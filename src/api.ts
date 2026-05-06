import type { Customer, NewCustomer, NewTraining, Training } from "./types";

const BASE_URL = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api"

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`);
  const data = await res.json();
  return data._embedded?.customers || [];
};

export const getTrainings = async (): Promise<Training[]> => {
  const res = await fetch(`${BASE_URL}/gettrainings`);
  const data = await res.json();
  return data || [];
};

export const addCustomer = async (customer: NewCustomer) => {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if(!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
}

export const addTraining = async (training: NewTraining) => {
  const response = await fetch(`${BASE_URL}/trainings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(training),
  });

  if (!response.ok) {
    throw new Error("Failed to add training");
  }

  return response.json();
};

export const deleteCustomer = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete customer")
  }
};

export const deleteTraining = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete training");
  }
};

export const updateCustomer = async (url: string, customer: NewCustomer) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }
};

export const updateTraining = async (training: Training) => {
  if (!training._links?.self.href) return;

  await fetch(training._links.self.href, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activity: training.activity,
      date: training.date,
      duration: training.duration,
      customer: training._links.self.href,
    }),
  });
};