import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

export default function Dashboard() {
    const [requestCount, setRequestCount] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    useEffect(() => {
        const ws = new WebSocket("wss://your-vercel-url.vercel.app/api/stats");
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRequestCount(data.total);
            setHistory(prev => [...prev.slice(-9), data.total]);
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        const ctx = document.getElementById("trafficChart") as HTMLCanvasElement;
        new Chart(ctx, {
            type: "line",
            data: {
                labels: Array(10).fill("").map((_, i) => `${i}s`),
                datasets: [{ label: "Traffic", borderColor: "red", data: history, fill: false }]
            },
        });
    }, [history]);

    return (
        <div className="container">
            <h1>Traffic Monitor</h1>
            <p>Total Requests: {requestCount}</p>
            <canvas id="trafficChart"></canvas>
        </div>
    );
}
