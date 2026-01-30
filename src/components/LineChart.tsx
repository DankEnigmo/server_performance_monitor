import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import type { AlignedData, Options, Series } from "uplot";

interface LineChartProps {
  data: AlignedData;
  title: string;
  yMin?: number;
  yMax?: number;
  unit?: string;
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

// Function to downsample data for better performance
const downsampleData = (
  data: AlignedData,
  maxPoints: number = 200,
): AlignedData => {
  if (data[0].length <= maxPoints) return data; // Already within limits

  const newData: AlignedData = [];
  const step = Math.ceil(data[0].length / maxPoints);

  for (let i = 0; i < data.length; i++) {
    const seriesData = data[i];
    const downsampledSeries: number[] = [];

    for (let j = 0; j < seriesData.length; j += step) {
      const value = seriesData[j];
      downsampledSeries.push(
        value !== undefined && value !== null ? value : NaN,
      );
    }

    // Convert to Float64Array as expected by uPlot
    newData.push(Float64Array.from(downsampledSeries));
  }

  return newData;
};

const LineChart: React.FC<LineChartProps> = React.memo(({ 
  data, 
  title,
  yMin = 0,
  yMax = 100,
  unit = "%"
}) => {
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

  // Downsample data for performance
  const downsampledData = useMemo(() => downsampleData(data, 200), [data]);

  const isMultiSeries = downsampledData.length > 2;

  const series: Series[] = useMemo(() => {
    const seriesArr: Series[] = [
      {}, // x-axis
    ];

    for (let i = 1; i < downsampledData.length; i++) {
      seriesArr.push({
        label: isMultiSeries ? `Core ${i - 1}` : "Value",
        stroke: seriesColors[(i - 1) % seriesColors.length],
        width: 2,
        fill: "rgba(34, 197, 94, 0.05)",
        scale: "y",
      });
    }
    return seriesArr;
  }, [downsampledData, isMultiSeries]);

  const options: Options = useMemo(
    () => ({
      title,
      width: chartWidth,
      height: 300,
      padding: [15, 15, 15, 15],
      series: series,
      scales: {
        y: {
          auto: false,
          range: [yMin, yMax],
        },
      },
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
          scale: "y",
          values: (_self, ticks) => ticks.map((v) => v.toFixed(0) + unit),
        },
      ],
      legend: {
        show: isMultiSeries,
      },
    }),
    [title, chartWidth, series, isMultiSeries, yMin, yMax, unit],
  );

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
    <div
      ref={chartRef}
      className="bg-black/20 p-2 rounded-lg border border-green-500/20 w-full"
    >
      <UplotReact options={options} data={downsampledData} />
    </div>
  );
});

LineChart.displayName = "LineChart";

export default LineChart;
