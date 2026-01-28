import { useState, useEffect } from 'react';
import type { Server } from '../types';

const STORAGE_KEY = 'monitoring_dashboard_servers_v2'; // Use a new key to avoid conflicts with old format

export const useServers = () => {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    try {
      const savedServers = localStorage.getItem(STORAGE_KEY);
      if (savedServers) {
        setServers(JSON.parse(savedServers));
      }
    } catch (error) {
      console.error("Failed to load servers from localStorage", error);
    }
  }, []);

  const saveServers = (newServers: Server[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newServers));
      setServers(newServers);
    } catch (error) {
      console.error("Failed to save servers to localStorage", error);
    }
  };

  const addServer = (server: { name: string; address: string }) => {
    if (server.address && !servers.some(s => s.address === server.address)) {
      const newServers = [...servers, server];
      saveServers(newServers);
    }
  };

  const removeServer = (address: string) => {
    const newServers = servers.filter(s => s.address !== address);
    saveServers(newServers);
  };

  return { servers, addServer, removeServer };
};
