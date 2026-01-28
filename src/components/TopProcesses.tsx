import React from "react";
import type { Process } from "../types";

interface TopProcessesProps {
  processes: Process[];
}

const TopProcesses: React.FC<TopProcessesProps> = ({ processes }) => {
  return (
    <div className="bg-black/20 pt-2 p-4 rounded-lg border border-green-500/20 text-green-400 font-mono">
      <h3 className="text-center font-black text-lg mb-4 text-green-500 ">
        Top Processes (by CPU)
      </h3>
      {processes.length === 0 ? (
        <p>No process data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-green-300 border-b border-green-500/30">
                <th className="py-2 px-1 w-2/12">PID</th>
                <th className="py-2 px-1 w-5/12">Name</th>
                <th className="py-2 px-1 w-2/12 text-right">CPU %</th>
                <th className="py-2 px-1 w-3/12 text-right">Mem (MB)</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr
                  key={p.pid}
                  className="border-b border-green-500/10 last:border-b-0 hover:bg-green-500/10"
                >
                  <td className="py-1 px-1 w-1/12">{p.pid}</td>
                  <td className="py-1 px-1 w-5/12 truncate max-w-xs" title={p.name}>{p.name}</td>
                  <td className="py-1 px-1 w-2/12 text-right">
                    {p.cpu.toFixed(1)}
                  </td>
                  <td className="py-1 px-1 w-3/12 text-right">
                    {p.mem.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopProcesses;
