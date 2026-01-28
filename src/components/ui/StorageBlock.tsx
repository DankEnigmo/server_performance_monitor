import React from "react";

interface StorageProps {
  mount: string; // e.g., "C:/" or "/mnt/data"
  sizeGB: number; // Total size
  usedGB: number; // Used size
  isNVMe?: boolean; // Changes icon/color
}

export const StorageBlock = ({
  mount,
  sizeGB,
  usedGB,
  isNVMe = false,
}: StorageProps) => {
  const percent = Math.min((usedGB / sizeGB) * 100, 100);
  const freeGB = (sizeGB - usedGB).toFixed(1);

  // Create 20 little "blocks" to visualize the drive
  const totalBlocks = 25;
  const filledBlocks = Math.ceil((percent / 100) * totalBlocks);

  return (
    <div className="border border-white/10 backdrop-blur-sm p-4 rounded-xl w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-gray-400 text-xs font-mono tracking-wider mb-1">
            {isNVMe ? "NVME_DRIVE" : "SATA_DRIVE"} // {mount}
          </h3>
          <div className="text-xl text-gray-100 font-bold font-mono">
            {percent.toFixed(0)}%{" "}
            <span className="text-xs text-gray-500 font-normal">USED</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-green-400 font-mono">
            {freeGB} GB FREE
          </div>
          <div className="text-[10px] text-gray-600">TOTAL: {sizeGB} GB</div>
        </div>
      </div>

      {/* The "Defrag" Style Visualizer */}
      <div className="flex gap-0.5 h-3 mt-2">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className={`
              flex-1 rounded-[1px] transition-all duration-500
              ${
                i < filledBlocks
                  ? isNVMe
                    ? "bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"
                    : "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                  : "bg-gray-800/50"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};
