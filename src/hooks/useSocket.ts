import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Metrics, StaticInfo } from "../types";

const MAX_HISTORY_LENGTH = 120;

export const useSocket = (serverAddress: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [staticInfo, setStaticInfo] = useState<StaticInfo | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<Metrics[]>([]);

  const historyRef = useRef<Metrics[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fullAddress = `http://${serverAddress}`;
    const newSocket = io(fullAddress, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleStaticInfo = (data: StaticInfo) => setStaticInfo(data);
    const handleMetrics = (data: Metrics) => {
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
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("static-info", handleStaticInfo);
    newSocket.on("metrics", handleMetrics);

    // Cleanup function
    return () => {
      // Remove all event listeners before disconnecting
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("static-info", handleStaticInfo);
      newSocket.off("metrics", handleMetrics);

      // Disconnect the socket
      if (newSocket.connected) {
        newSocket.disconnect();
      }

      // Clear references
      if (socketRef.current === newSocket) {
        socketRef.current = null;
      }

      // Clear history
      historyRef.current = [];
    };
  }, [serverAddress]);

  return { socket, isConnected, staticInfo, metrics, metricsHistory };
};
