import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Metrics, StaticInfo } from "../types";

const MAX_HISTORY_LENGTH = 120; // Keep last 2 minutes of data (at 1s interval)

export const useSocket = (serverAddress: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [staticInfo, setStaticInfo] = useState<StaticInfo | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<Metrics[]>([]);

  const historyRef = useRef<Metrics[]>([]);

  useEffect(() => {
    const fullAddress = `http://${serverAddress}`;
    const newSocket = io(fullAddress, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("static-info", (data: StaticInfo) => setStaticInfo(data));

    newSocket.on("metrics", (data: Metrics) => {
      setMetrics(data);
      historyRef.current = [...historyRef.current, data];
      if (historyRef.current.length > MAX_HISTORY_LENGTH) {
        historyRef.current.splice(
          0,
          historyRef.current.length - MAX_HISTORY_LENGTH,
        );
      }
      // Set state with a copy to trigger re-render
      setMetricsHistory([...historyRef.current]);
    });

    return () => {
      newSocket.disconnect();
      historyRef.current = [];
    };
  }, [serverAddress]);

  return { socket, isConnected, staticInfo, metrics, metricsHistory };
};
