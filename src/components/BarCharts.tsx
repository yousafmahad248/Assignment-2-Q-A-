import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Process } from "../types";

interface BarChartsProps {
  processes: Process[];
}

export const BarCharts: React.FC<BarChartsProps> = ({ processes }) => {
  if (processes.length === 0) {
    return null;
  }

  // Map process data for Recharts
  const data = processes.map((p) => ({
    name: p.id,
    "Waiting Time": p.waitingTime || 0,
    "Turnaround Time": p.turnaroundTime || 0,
    "Burst Time": p.burstTime,
    "Arrival Time": p.arrivalTime,
  }));

  // Define colors for customized bars matching Elegant Dark theme
  const colors = [
    "#58a6ff", // Elegant Blue
    "#3fb950", // Elegant Green
    "#d29922", // Elegant Yellow
    "#f85149", // Elegant Red
    "#56d364", // Elegant Light Green
    "#ff7b72", // Elegant Orange-Red
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg shadow-xl text-xs font-sans">
          <p className="font-semibold text-gray-200 mb-1.5">{`Process: ${label}`}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-gray-400 my-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span>{item.name}: </span>
              <span className="font-semibold text-gray-100">{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
      {/* Waiting Time Chart */}
      <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 shadow-md">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Waiting Time Comparison
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tickLine={false} />
              <YAxis stroke="#6b7280" tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#111827", opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="Waiting Time" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Turnaround Time Chart */}
      <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 shadow-md">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Turnaround Time Comparison
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tickLine={false} />
              <YAxis stroke="#6b7280" tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#111827", opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="Turnaround Time" fill="#10b981" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-tat-${index}`} fill={colors[(index + 1) % colors.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
