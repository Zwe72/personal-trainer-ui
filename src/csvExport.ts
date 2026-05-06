import { saveAs } from "file-saver";
import type { Customer, Training } from "./types";
import dayjs from "dayjs";

export const exportCustomersCSV = (customers: Customer[]) => {
    const rows = customers.map((c) => ({
        firstname: c.firstname,
        lastname: c.lastname,
    }));

    const csv =
    "First name,Last name\n" +
    rows.map((r) => `"${r.firstname}","${r.lastname}"`).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;"});
    saveAs(blob, "customers.csv");
}

export const exportTrainingsCSV = (trainings: Training[]) => {
    const rows = trainings.map((t) => ({
        activity: t.activity,
        date: dayjs(t.date).format("DD.MM.YYYY HH:mm"),
        duration: t.duration,
        customer: `${t.customer.firstname} ${t.customer.lastname}`,
    }));

    const csv =
    "Activity,Date,Duration,Customer\n" +
    rows
    .map((r) => `"${r.activity}","${r.date}","${r.duration}","${r.customer}"`)
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "trainings.csv");
}