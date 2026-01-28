import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ServerDetailPage from "./pages/ServerDetailPage";
import { MatrixText } from "@/components/ui/matrix-text";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

function App() {
  return (
    <div className="relative min-h-screen p-4">
      <FlickeringGrid
        className="absolute inset-0 size-full z-0"
        color="#22c55e" // green-500
        maxOpacity={0.1}
        flickerChance={0.05}
      />
      <div className="relative z-10">
        <header className="max-w-4xl mx-auto mb-6 mt-3 flex justify-center">
          <img
            src="/3_logo_green.png"
            alt="ThreyeEye Logo"
            className="w-16 h-16 mr-4"
          />
          <MatrixText
            text="SERVER PERFORMANCE MONITOR"
            className="text-2xl md:text-5xl font-bold text-green-500 tracking-widest"
          />
        </header>
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/server/:serverAddress"
              element={<ServerDetailPage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
