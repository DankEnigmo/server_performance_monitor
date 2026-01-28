import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import type { AlignedData, Options, Series } from "uplot";

interface LineChartProps {
  data: AlignedData;
  title: string;
}

const seriesColors = [
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#eab308", // yellow-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
];

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [chartWidth, setChartWidth] = useState(400);

  const updateChartWidth = useCallback(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    // Clean up any existing observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setChartWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(chartRef.current);
    resizeObserverRef.current = observer;

    // Initial width update
    updateChartWidth();

    return () => {
      // Properly disconnect the observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [updateChartWidth]);

  const isMultiSeries = data.length > 2;

  const series: Series[] = [
    {}, // x-axis
  ];

  for (let i = 1; i < data.length; i++) {
    series.push({
      label: isMultiSeries ? `Core ${i - 1}` : "Value",
      stroke: seriesColors[(i - 1) % seriesColors.length],
      width: 2,
      fill: "rgba(34, 197, 94, 0.05)",
    });
  }

  const options: Options = {
    title,
    width: chartWidth,
    height: 300,
    padding: [15, 15, 15, 15],
    series: series,
    axes: [
      {
        stroke: "#22c55e",
        grid: { show: true, stroke: "rgba(34, 197, 94, 0.1)" },
        ticks: { stroke: "rgba(34, 197, 94, 0.3)" },
      },
      {
        stroke: "#22c55e",
        grid: { show: true, stroke: "rgba(34, 197, 94, 0.1)" },
        ticks: { stroke: "rgba(34, 197, 94, 0.3)" },
      },
    ],
    legend: {
      show: isMultiSeries,
    },
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Clean up any remaining observer reference
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={chartRef} className="bg-black/20 p-2 rounded-lg border border-green-500/20 w-full">
      <UplotReact options={options} data={data} />
    </div>
  );
};

export default LineChart;