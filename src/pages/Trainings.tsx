import { useEffect, useState } from "react";
import type { Customer, Training } from "../types";
import { getCustomers, getTrainings } from "../api";
import dayjs from "dayjs";

export default function Trainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getTrainings().then(setTrainings);
        getCustomers().then(setCustomers);
    }, []);

    const getCustomerName = (link?: string): string => {
        if (!link) return "";

        const id = link.split("/").pop();
        const c = customers.find(c => c.id === Number(id));

        return c ? `${c.firstname} ${c.lastname}` : "";
    };

    const filtered = trainings.filter(t =>
        t.activity?.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => 
        a.activity.localeCompare(b.activity)
    );

    return (
        <div>
            <h1>Trainings</h1>

            <input
                placeholder="Search activity..."
                onChange={(e) => setSearch(e.target.value)}
            />
            
            <table border={1}>
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Customer</th>
                    </tr>
                </thead>

                <tbody>
                    {sorted.map(t => (
                        <tr key={t.id}>
                            <td>{t.activity}</td>
                            
                            <td>
                                {t.date ? dayjs(t.date).format("DD.MM.YYYY HH:mm") : ""}
                            </td>

                            <td>{t.duration} min</td>

                            <td>{getCustomerName(t.customer)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}