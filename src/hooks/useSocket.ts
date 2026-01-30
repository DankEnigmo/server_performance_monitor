import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Metrics, StaticInfo } from "../types";

const MAX_HISTORY_LENGTH = 120;
const METRICS_UPDATE_INTERVAL = 500; // Throttle updates to every 500ms

// Efficient circular buffer implementation for metrics history
class CircularBuffer<T> {
  private buffer: T[];
  private size: number;
  private head: number = 0;
  private count: number = 0;

  constructor(size: number) {
    this.buffer = new Array(size);
    this.size = size;
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.size;
    if (this.count < this.size) {
      this.count++;
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const index = (this.head - this.count + i + this.size) % this.size;
      result.push(this.buffer[index]);
    }
    return result;
  }

  clear(): void {
    this.head = 0;
    this.count = 0;
  }
}

export const useSocket = (serverAddress: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [staticInfo, setStaticInfo] = useState<StaticInfo | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<Metrics[]>([]);

  const historyRef = useRef<CircularBuffer<Metrics>>(
    new CircularBuffer<Metrics>(MAX_HISTORY_LENGTH),
  );
  const socketRef = useRef<Socket | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const throttledHandleMetrics = useCallback((data: Metrics) => {
    const now = Date.now();

    // Only update if enough time has passed since last update
    if (now - lastUpdateRef.current >= METRICS_UPDATE_INTERVAL) {
      setMetrics(data);
      lastUpdateRef.current = now;

      // Update history using circular buffer
      historyRef.current.push(data);

      // Set state with a copy to trigger re-render
      setMetricsHistory([...historyRef.current.toArray()]);
    }
  }, []);

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
    const handleMetrics = (data: Metrics) => throttledHandleMetrics(data);

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
      historyRef.current.clear();
    };
  }, [serverAddress, throttledHandleMetrics]);

  return { socket, isConnected, staticInfo, metrics, metricsHistory };
};
