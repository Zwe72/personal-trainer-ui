import moment from "moment";
import { useEffect, useState } from "react";
import { getTrainings } from "../api";
import type { Training } from "../types";
import { Calendar, momentLocalizer, Views, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";


const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const [date, setDate] = useState(new Date())
    const [events, setEvents] = useState<any[]>([]);
    const [view, setView] = useState<View>(Views.WEEK);

    useEffect(() => {
        const fetch = async () => {
            const trainings: Training[] = await getTrainings();

            const mapped = trainings.map((t) => ({
                title: `${t.activity} / ${t.customer.firstname} ${t.customer.lastname}`,
                start: new Date(t.date),
                end: new Date(new Date(t.date).getTime() + t.duration * 60000),
            }));

            setEvents(mapped);
        };

        fetch();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
        
        <h1 style={{ marginBottom: "20px" }}>PersonalTrainer</h1>

        <div style={{ height: "80vh", background: "white", padding: "10px" }}>
            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView)}
            views={["month", "week", "day", "agenda"]}
            step={30}
            timeslots={2}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            style={{ height: "100%" }}
            />
        </div>
    </div>
    );
}