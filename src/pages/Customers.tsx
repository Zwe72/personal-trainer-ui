import { useEffect, useState } from "react";
import type { Customer, NewCustomer } from "../types";
import { addCustomer, deleteCustomer, getCustomers, updateCustomer } from "../api";
import { exportCustomersCSV } from "../csvExport";

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"firstname" | "lastname">("firstname");

    const [newCustomer, setNewCustomer] = useState<NewCustomer>({
        firstname:"",
        lastname: "",
    });

    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

    //fetch
    const fetchCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    //add + edit
    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            if (editCustomer && editCustomer._links?.self.href) {
                //update
                await updateCustomer(
                    editCustomer._links.self.href,
                    newCustomer
                    
                );

                fetchCustomers();
            } else {
                //add
                await addCustomer(newCustomer);
                fetchCustomers();
            }
            //reset
            setNewCustomer({
                firstname:"",
                lastname:"",
            });

            setEditCustomer(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditCustomer(customer);

        setNewCustomer({
            firstname: customer.firstname,
            lastname: customer.lastname,
        });
    };

    //delete
    const handleDelete = async (customer: Customer) => {
        if (!window.confirm("Delete this customer?")) return;

        try {
            if (customer._links?.self.href) {
                await deleteCustomer(customer._links.self.href);
                fetchCustomers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    //filter
    const filtered = customers.filter(c =>
        `${c.firstname} ${c.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    //sort
    const sorted = [...filtered].sort((a, b) =>
        a[sort].localeCompare(b[sort])
    );

    return (
        <div>
            <h1>Customers</h1>
            
            {/* CSV EXPORT */}
            <button onClick={() => exportCustomersCSV(sorted)}>
                Export CSV
            </button>

            {/* ADD FORM */}
            <form onSubmit={handlesubmit}>
                <input
                placeholder="First name"
                value={newCustomer.firstname}
                onChange={(e) =>
                    setNewCustomer({ ...newCustomer, firstname: e.target.value })
                }
                />

                <input
                placeholder="Last name"
                value={newCustomer.lastname}
                onChange={(e) =>
                    setNewCustomer({ ...newCustomer, lastname: e.target.value })
                }
                />

                <button type="submit">
                    {editCustomer ? "Update" : "Add"}
                </button>
            </form>

             {/* SEARCH */}
            <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            />

            {/* SORT */}
            <select onChange={(e) => setSort(e.target.value as any)}>
                <option value="firstname">First name</option>
                <option value="lastname">Last name</option>
            </select>

            {/* TABLE */}
            <table border={1}>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sorted.map(c => (
                        <tr key={c._links?.self.href}>
                            <td>{c.firstname}</td>
                            <td>{c.lastname}</td>
                            <td>
                                <button onClick={() => handleDelete(c)}>Delete</button>
                                <button onClick={() => handleEdit(c)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}