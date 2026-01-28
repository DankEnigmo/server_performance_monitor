import React, { useState } from "react";
import { useServers } from "../hooks/useServers";
import ServerCard from "../components/ServerCard";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import { GlowingEffect } from "../components/ui/GlowingEffect";

const DashboardPage: React.FC = () => {
  const { servers, addServer, removeServer } = useServers();
  const [newServerName, setNewServerName] = useState("");
  const [newServerAddress, setNewServerAddress] = useState("");

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) {
      alert("Please enter a server name.");
      return;
    }
    // Basic validation for host:port format
    if (/^[^:]+:\d+$/.test(newServerAddress)) {
      addServer({ name: newServerName, address: newServerAddress });
      setNewServerName("");
      setNewServerAddress("");
    } else {
      alert(
        "Please enter a valid address in host:port format (e.g., localhost:8080)",
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <form
          onSubmit={handleAddServer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center"
        >
          <FloatingLabelInput
            id="serverName"
            label="Server Name"
            type="text"
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
            required
          />
          <div className="flex gap-4">
            <FloatingLabelInput
              id="serverAddress"
              label="Address"
              type="text"
              value={newServerAddress}
              onChange={(e) => setNewServerAddress(e.target.value)}
              required
            />
            <button
              type="submit"
              className="relative bg-green-500/40  text-lime-500 font-bold px-4 py-2 rounded hover:bg-green-500 hover:text-black whitespace-nowrap h-10"
            >
              <GlowingEffect variant="green" disabled={false} borderWidth={2} />
              <span className="relative z-10">Add Server</span>
            </button>
          </div>
        </form>
      </div>
      {servers.length === 0 ? (
        <div className="text-center border border-dashed border-green-500/30 p-10 rounded-lg">
          <p className="text-lg">No servers added yet.</p>
          <p className="text-sm text-white/50">
            Use the form above to add a server to monitor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.address}
              name={server.name}
              address={server.address}
              removeServer={removeServer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
