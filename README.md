# Server Stats Frontend

This is the web-based dashboard for the Real-Time Server Resource Monitoring system. It provides a highly interactive and visually appealing interface to monitor CPU, RAM, and GPU telemetry from connected `server_stats_agent` instances.

## Features

*   **Multi-Server Dashboard:** Add and monitor multiple server agents.
*   **Real-time Metrics:** Displays live CPU, RAM, and GPU usage with sub-second latency.
*   **Interactive Visualizations:** Utilizes `uPlot` for historical line charts and custom gauges.
*   **Themed UI:** Features a "Matrix" theme with `green-500` accents and animated backgrounds.
*   **High Performance:** Optimized for smooth rendering even with multiple servers and continuous metric updates.

## Performance Optimizations

The frontend includes several performance enhancements to ensure smooth operation:

*   **Throttled Updates:** Metrics are processed at most once every 500ms to prevent excessive UI updates
*   **Efficient Data Structures:** Uses circular buffers for metrics history to maintain constant memory usage
*   **Component Memoization:** Heavily optimized with React.memo and useMemo to prevent unnecessary re-renders
*   **Chart Data Sampling:** Automatically downsamples chart data to maintain rendering performance
*   **Optimized Rendering:** Gauges and charts only update when values actually change

## Technology Stack

*   **Framework:** React + TypeScript + Vite
*   **Styling:** Tailwind CSS, `shadcn/ui`, `aceternity/ui`
*   **Charting:** `uPlot`
*   **State Management:** `socket.io-client` for real-time data, `localStorage` for persistence.

## Setup & Run

1.  **Navigate to the frontend directory:**
    ```bash
    cd server_stats_frontend/
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    (Ensure the `server_stats_agent` is running in a separate terminal)