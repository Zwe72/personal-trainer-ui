import { useEffect, useMemo, useState } from "react";
import type { Training } from "../types";
import { getTrainings } from "../api";
import { groupBy, sumBy } from "lodash";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function StatsPage() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    //fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTrainings();
                setTrainings(data);
            } catch (error) {
                console.error("Error fetching trainings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // group + sum
    const chartData = useMemo(() => {
        const grouped = groupBy(trainings, (t) =>
        t.activity.trim().toLowerCase());

        return Object.entries(grouped).map(([activity, items]) => ({
            activity,
            minutes: sumBy(items, "duration"),
        }));
    }, [trainings]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box> 
        );
    }

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Statistics
            </Typography>

            <Typography sx={{ mb: 3 }}>
                Total training minutes by activity
            </Typography>

            <Box sx={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="activity" />
                        <YAxis
                            label={{
                                value: "Duration (min)",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />
                        <Tooltip />
                        <Bar dataKey="minutes" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 3 }}>
                {chartData.map((row) => (
                    <Typography key={row.activity}>
                        {row.activity}: {row.minutes} min
                    </Typography>
                ))}
            </Box>
        </Paper>
    );
}