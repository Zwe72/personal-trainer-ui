import { useEffect, useState } from "react";
import type { Customer } from "../types";
import { getCustomers } from "../api";

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"firstname" | "lastname">("firstname");

    useEffect(() => {
        getCustomers().then(setCustomers);
    }, []);

    const filtered = customers.filter(c =>
        `${c.firstname} ${c.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) =>
        a[sort].localeCompare(b[sort])
    );

    return (
        <div>
            <h1>Customers</h1>

            <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            />

            <select onChange={(e) => setSort(e.target.value as any)}>
                <option value="firstname">First name</option>
                <option value="lastname">Last name</option>
            </select>

            <table border={1}>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                    </tr>
                </thead>

                <tbody>
                    {sorted.map(c => (
                        <tr key={c.id}>
                            <td>{c.firstname}</td>
                            <td>{c.lastname}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}