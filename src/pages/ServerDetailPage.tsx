import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useServers } from "../hooks/useServers";
import AdvancedGauge from "../components/AdvancedGauge";
import LineChart from "../components/LineChart";
import TopProcesses from "../components/TopProcesses"; // Import the new component
import { StorageBlock } from "../components/ui/StorageBlock";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs"; // Import shadcn/ui Tabs components
import type { AlignedData } from "uplot";

const ServerDetailPage: React.FC = () => {
  const { serverAddress } = useParams<{ serverAddress: string }>();
  const { servers } = useServers();

  const currentServer = serverAddress ? servers.find(
    (s) => s.address === decodeURIComponent(serverAddress),
  ) : undefined;
  const displayServerName = currentServer
    ? currentServer.name
    : serverAddress ? decodeURIComponent(serverAddress) : 'Unknown Server';

  if (!serverAddress) {
    return <div>Invalid server address.</div>;
  }

  const { isConnected, staticInfo, metrics, metricsHistory } = useSocket(
    decodeURIComponent(serverAddress),
  );

  useEffect(() => {
    if (staticInfo) {
      console.log("Received Static Info:", staticInfo);
    }

    // Cleanup function for this component
    return () => {
      // Any cleanup logic for this page would go here
      // Currently, cleanup is handled in the useSocket hook
    };
  }, [staticInfo]);

  // Filter out metrics history if staticInfo or metrics are null
  const filteredMetricsHistory = staticInfo && metrics ? metricsHistory : [];

  // CPU Chart Data
  const cpuChartData: AlignedData = [
    filteredMetricsHistory.map((m) => m.ts / 1000), // Timestamps in seconds
    filteredMetricsHistory.map((m) => m.cpu.percent),
  ];

  // RAM Chart Data
  const ramChartData: AlignedData = [
    filteredMetricsHistory.map((m) => m.ts / 1000),
    filteredMetricsHistory.map((m) => m.ram.percent),
  ];

  // CPU Temperature Chart Data
  const cpuTempChartData: AlignedData = [
    filteredMetricsHistory.map((m) => m.ts / 1000),
    filteredMetricsHistory.map((m) => m.cpu.temperature ?? 0),
  ];

  const gpuTabs = React.useMemo(() => {
    if (!staticInfo?.gpus || staticInfo.gpus.length === 0) return null;

    return (
      <Tabs defaultValue={`gpu-0`}>
        <TabsList className="h-auto gap-2 rounded-none border-b border-green-500/20 bg-transparent px-0 py-1 text-green-300/60">
          {staticInfo.gpus.map((gpu, index) => (
            <TabsTrigger
              key={`gpu-tab-trigger-${gpu.id}`}
              value={`gpu-${index}`}
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-green-500/10 hover:text-green-300 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-green-500 data-[state=active]:hover:bg-green-500/10"
            >
              GPU {index}
            </TabsTrigger>
          ))}
        </TabsList>
        {staticInfo.gpus.map((gpu, index) => {
          const gpuMetricsHistory = filteredMetricsHistory.map(
            (m) =>
              m.gpu.find((g) => g.id === gpu.id) || {
                load: 0,
                temperature: 0,
                memoryUtil: 0,
                memoryUsed: 0,
                id: gpu.id,
              },
          );

          const gpuChartData: AlignedData = [
            filteredMetricsHistory.map((m) => m.ts / 1000),
            gpuMetricsHistory.map((m) => m.load * 100),
          ];

          const gpuTempChartData: AlignedData = [
            filteredMetricsHistory.map((m) => m.ts / 1000),
            gpuMetricsHistory.map((m) => m.temperature),
          ];

          return (
            <TabsContent
              key={`gpu-tab-content-${gpu.id}`}
              value={`gpu-${index}`}
            >
              <div className="flex flex-col gap-8 mt-6">
                {/* Gauges for this GPU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
                  <AdvancedGauge
                    value={
                      (gpuMetricsHistory[gpuMetricsHistory.length - 1]?.load ??
                        0) * 100
                    }
                    label={`GPU ${index} Load`}
                  />
                  <AdvancedGauge
                    value={
                      gpuMetricsHistory[gpuMetricsHistory.length - 1]
                        ?.temperature ?? 0
                    }
                    label={`GPU ${index} Temp`}
                    unit="°C"
                    max={120}
                  />
                </div>

                {/* Line Charts for this GPU */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 backdrop-blur-lg">
                  <LineChart
                    data={gpuChartData}
                    title={`GPU ${index} Load`}
                    unit="%"
                  />
                  <LineChart
                    data={gpuTempChartData}
                    title={`GPU ${index} Temperature`}
                    yMin={0}
                    yMax={100}
                    unit="°C"
                  />
                </div>

                {/* Static Info for this GPU */}
                <div className="border border-green-500/20 p-4 rounded-lg backdrop-blur-md text-sm">
                  <h3 className="font-bold text-lg mb-2">
                    GPU {gpu.id} Details
                  </h3>
                  <p>
                    <strong>Model:</strong> {gpu.name}
                  </p>
                  <p>
                    <strong>Memory:</strong> {gpu.memoryTotal} MB
                  </p>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    );
  }, [staticInfo, filteredMetricsHistory]);

  return (
    <>
      <div className="mb-4">
        <Link to="/" className="text-green-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 break-all">{displayServerName}</h2>

      {!isConnected && (
        <div className="text-center text-red-500 text-lg">Connecting...</div>
      )}

      {isConnected && !metrics && (
        <div className="text-center text-lg">Waiting for data...</div>
      )}

      {isConnected && staticInfo && metrics && (
        <div className="flex flex-col gap-8">
          {/* Storage Blocks */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {staticInfo.storage.map((drive) => (
              <StorageBlock
                key={drive.name}
                mount={drive.name}
                sizeGB={+(drive.total / 1024 ** 3).toFixed(2)}
                usedGB={+(drive.used / 1024 ** 3).toFixed(2)}
                isNVMe={drive.type.toLowerCase().includes("nvme")}
              />
            ))}
          </div>

          {/* CPU & RAM Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
            <AdvancedGauge value={metrics.cpu.percent} label="CPU" />
            <AdvancedGauge
              value={metrics.cpu.temperature ?? 0}
              label="CPU Temp"
              unit="°C"
              max={120}
            />
            <AdvancedGauge value={metrics.ram.percent} label="RAM" />
          </div>

          {/* Main Charts & Processes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 backdrop-blur-lg">
            <LineChart data={cpuChartData} title="CPU Usage" unit="%" />
            <LineChart data={ramChartData} title="RAM Usage" unit="%" />
            <LineChart data={cpuTempChartData} title="CPU Temperature" yMin={0} yMax={100} unit="°C" />
            {metrics.processes && (
              <TopProcesses processes={metrics.processes} />
            )}
          </div>

          {/* GPU Tabs */}
          {staticInfo.gpus.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">GPU Information</h3>
              {gpuTabs}
            </div>
          )}

          {/* Other Static Info (System, CPU, RAM) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm backdrop-blur-lg">
            <div className="border border-green-500/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">System</h3>
              <p>
                <strong>OS:</strong> {staticInfo.os.distro}{" "}
                {staticInfo.os.release}
              </p>
              <p>
                <strong>Arch:</strong> {staticInfo.os.arch}
              </p>
            </div>
            <div className="border border-green-500/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">CPU</h3>
              <p>
                <strong>Model:</strong> {staticInfo.cpu.brand}
              </p>
              <p>
                <strong>Cores:</strong> {staticInfo.cpu.cores} (
                {staticInfo.cpu.physicalCores} Physical)
              </p>
              <p>
                <strong>Speed:</strong> {staticInfo.cpu.speed}GHz
              </p>
              {metrics.cpu.temperature && (
                <p>
                  <strong>Temp:</strong> {metrics.cpu.temperature}°C
                </p>
              )}
            </div>
            <div className="border border-green-500/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">RAM</h3>
              <p>
                <strong>Total:</strong>{" "}
                {(staticInfo.mem.total / 1024 ** 3).toFixed(2)} GB
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServerDetailPage;
