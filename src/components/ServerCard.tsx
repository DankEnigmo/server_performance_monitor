import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import AdvancedGauge from "./AdvancedGauge";
import { GlowingEffect } from "./ui/GlowingEffect";

interface ServerCardProps {
  name: string;
  address: string;
  removeServer: (address: string) => void;
}

const ServerCard: React.FC<ServerCardProps> = memo(({
  name,
  address,
  removeServer,
}) => {
  const { isConnected, metrics } = useSocket(address);

  // Memoize the metric values to prevent unnecessary re-renders
  const { cpuUsage, ramUsage, gpuUsage } = useMemo(() => {
    return {
      cpuUsage: metrics?.cpu?.percent ?? 0,
      ramUsage: metrics?.ram?.percent ?? 0,
      gpuUsage: (metrics?.gpu?.[0]?.load ?? 0) * 100, // Assuming first GPU
    };
  }, [metrics]);

  return (
    <div className="relative border border-green-500/70 rounded-lg p-6 backdrop-blur-md">
      <GlowingEffect variant="green" disabled={false} borderWidth={4} />
      <div className="flex justify-start items-center mb-4 gap-2">
        <div
          className={`w-3 h-3 rounded-full shrink-0 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <h3 className="font-bold text-lg truncate" title={name}>
          {name}
        </h3>
      </div>

      {!isConnected && (
        <div className="text-center text-red-500">Connecting...</div>
      )}

      {isConnected && metrics && (
        <Link to={`/server/${encodeURIComponent(address)}`}>
          <div className="grid grid-cols-3 gap-6 text-center">
            <AdvancedGauge value={cpuUsage} label="CPU" />
            <AdvancedGauge value={ramUsage} label="RAM" />
            <AdvancedGauge value={gpuUsage} label="GPU" />
          </div>
        </Link>
      )}

      <button
        onClick={() => removeServer(address)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold"
        aria-label="Remove Server"
      >
        &#x2715;
      </button>
    </div>
  );
});

ServerCard.displayName = 'ServerCard';

export default ServerCard;
