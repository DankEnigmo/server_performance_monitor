import React from "react";
import GaugeComponent from "react-gauge-component";

interface AdvancedGaugeProps {
  value: number;
  label: string;
  unit?: string;
  max?: number;
}

const AdvancedGauge: React.FC<AdvancedGaugeProps> = ({
  value,
  label,
  unit = "%",
  max = 100,
}) => {
  const colorArray = ["#5BE12C", "#F5CD19", "#EA4228"]; // Green, Yellow, Red

  const getSubArcs = () => {
    const nbSubArcs = 50;
    const subArcs = [];
    for (let i = 1; i <= nbSubArcs; i++) {
      const limit = (i / nbSubArcs) * max;
      let color;
      if (limit <= max * 0.5) {
        color = colorArray[0];
      } else if (limit <= max * 0.75) {
        color = colorArray[1];
      } else {
        color = colorArray[2];
      }
      subArcs.push({ limit, color });
    }
    return subArcs;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <GaugeComponent
        value={value}
        type="radial"
        minValue={0}
        maxValue={max}
        arc={{
          width: 0.2,
          padding: 0.01,
          subArcs: getSubArcs(),
        }}
        pointer={{
          type: "needle",
          elastic: true,
          animationDuration: 1500,
          color: "#93f2a3",
          length: 0.8,
          width: 8,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (val) => `${val.toFixed(0)}${unit}`,
            matchColorWithArc: true,
            style: {
              fontSize: "22px",
              fill: "currentColor",
              fontWeight: "bold",
            },
            offsetY: 25,
          },
          tickLabels: {
            type: "inner",
            ticks: [
              { value: 0 },
              { value: max * 0.25 },
              { value: max * 0.5 },
              { value: max * 0.75 },
              { value: max },
            ],
            defaultTickValueConfig: {
              formatTextValue: (val) => `${val}`,
              style: {
                fill: "#a3e635", // lime-400
                fontSize: 10,
                fontWeight: "bold",
              },
            },
            defaultTickLineConfig: {
              color: "#a3e635",
              height: 5,
            },
          },
        }}
        startAngle={-120}
        endAngle={120}
      />
      <div className="mt-[0px] text-base font-semibold text-green-400">
        {label}
      </div>
    </div>
  );
};

export default AdvancedGauge;
