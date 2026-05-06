import { useEffect, useState } from "react";
import type { Customer, NewTraining, Training } from "../types";
import { addTraining, deleteTraining, getCustomers, getTrainings } from "../api";
import dayjs from "dayjs";
import { exportTrainingsCSV } from "../csvExport";

export default function Trainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");

    const [newTraining, setNewTraining] = useState<NewTraining>({
        activity: "",
        duration: 0,
        date: new Date().toISOString(),
        customer: "",
    });

    // fetch
    const fetchTrainings = async () => {
        const data = await getTrainings();
        setTrainings(data);
    };

    const fetchCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    }

    useEffect(() => {
        fetchTrainings();
        fetchCustomers();
    }, []);

    //add
    const handleAddTraining = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTraining.activity || !newTraining.customer || newTraining.duration <= 0) {
            alert("Fill all fields and duration must be greater than 0");
            return;
        }

        try {
            await addTraining(newTraining);
            fetchTrainings();

            setNewTraining({
                activity: "",
                duration: 0,
                date: new Date().toISOString(),
                customer: "",
            });
        } catch (err) {
            console.error(err);
        }
    };

    //delete
    const handleDelete = async (training: Training) => {
        if (!window.confirm("Delete this training?")) return;

        try {
            if (training._links?.self.href) {
                await deleteTraining(training._links.self.href);
                fetchTrainings();
            }
        } catch (err) {
            console.error(err);
        }
    };

    //filter
    const filtered = trainings.filter(t =>
        t.activity?.toLowerCase().includes(search.toLowerCase())
    );

    //sort
    const sorted = [...filtered].sort((a, b) => 
        a.activity.localeCompare(b.activity)
    );

    return (
        <div>
            <h1>Trainings</h1>

            {/* CSV EXPORT */}
            <button onClick={() => exportTrainingsCSV(sorted)}>
                Export CSV
            </button>

            <br />
            <br />
            
            {/*  ADD FORM */}
            <form onSubmit={handleAddTraining}>
                <input
                placeholder="Activity"
                value={newTraining.activity}
                onChange={(e) =>
                    setNewTraining({ ...newTraining, activity: e.target.value })
                }/>

                <input
                type="number"
                placeholder="Duration (min)"
                value={newTraining.duration}
                onChange={(e) =>
                    setNewTraining({
                    ...newTraining,
                    duration: Number(e.target.value),
                    })
                }
                />

                {/* date input */}
                <input
                type="datetime-local"
                value={dayjs(newTraining.date).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                    setNewTraining({
                    ...newTraining,
                    date: new Date(e.target.value).toISOString(),
                    })
                }
                />

                 {/* select customer */}
                <select
                value={newTraining.customer}
                onChange={(e) =>
                    setNewTraining({
                    ...newTraining,
                    customer: e.target.value,
                    })
                }
                >
                <option value="">Select customer</option>
                {customers.map(c => (
                    <option key={c._links?.self.href} value={c._links?.self.href}>
                    {c.firstname} {c.lastname}
                    </option>
                ))}
                </select>

                <button type="submit">Add Training</button>
            </form>

            <br />

            {/* SEARCH */}
            <input
                placeholder="Search activity..."
                onChange={(e) => setSearch(e.target.value)}
            />
            
            {/* TABLE */}
            <table border={1}>
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Customer</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sorted.map(t => (
                        <tr key={t._links?.self.href}>
                            <td>{t.activity}</td>
                            
                            <td>
                                {dayjs(t.date).format("DD.MM.YYYY HH:mm")}
                            </td>

                            <td>{t.duration} min</td>

                            <td>
                                {t.customer
                                ? `${t.customer.firstname} ${t.customer.lastname}`
                                : ""}
                            </td>

                            <td>
                                <button onClick={() => handleDelete(t)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}