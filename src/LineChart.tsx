import React, { useEffect, useRef, useState } from "react";

interface LineChartProps {
  data: number[];
  labels: string[];
}

const LineChart: React.FC<LineChartProps> = ({ data, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const maxValue = Math.max(...data);
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const pointRadius = 4;
    const yTicks = 5;
    const yTickInterval = maxValue / yTicks;

    const getXPosition = (index: number) =>
      padding + (index / (data.length - 1)) * chartWidth;
    const getYPosition = (value: number) =>
      height - padding - (value / maxValue) * chartHeight;

    function drawChart() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height); // Clear the canvas

      // Draw Y-axis tick marks and labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      for (let i = 0; i <= yTicks; i++) {
        const value = i * yTickInterval;
        const y = getYPosition(value);
        ctx.beginPath();
        ctx.moveTo(padding - 5, y);
        ctx.lineTo(padding, y);
        ctx.fillText(value.toLocaleString(), padding - 10, y);
      }

      // Create linear gradient for area below line
      const gradient = ctx.createLinearGradient(
        0,
        padding,
        0,
        height - padding
      );
      gradient.addColorStop(0, "#EF76314f");
      gradient.addColorStop(1, "#EF76311f");

      // Draw line connecting the data points
      ctx.beginPath();
      ctx.strokeStyle = "#EF7631";
      ctx.lineWidth = 2;
      data.forEach((value, index) => {
        const x = getXPosition(index);
        const y = getYPosition(value);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Fill the area under the line
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw points and tooltip
      if (hoveredIndex !== null) {
        const value = data[hoveredIndex];
        const x = getXPosition(hoveredIndex);
        const y = getYPosition(value);
        ctx.fillStyle = "#EF7631"; // Highlight color for hovered point
        ctx.beginPath();
        ctx.arc(x, y, pointRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Show tooltip above the hovered point
        if (tooltipRef.current) {
          tooltipRef.current.innerText = `Value: ${value.toLocaleString()}`;
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = `${x}px`;
          tooltipRef.current.style.top = `${y + 30}px`; // Position above the bullet
        }
      } else {
        // Draw the last point if no point is hovered
        const lastIndex = data.length - 1;
        const lastX = getXPosition(lastIndex);
        const lastY = getYPosition(data[lastIndex]);

        ctx.fillStyle = "#e74c3c"; // Highlight color for last point
        ctx.beginPath();
        ctx.arc(lastX, lastY, pointRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Show tooltip for last point when no point is hovered
        if (tooltipRef.current) {
          tooltipRef.current.innerText = `Value: ${data[
            lastIndex
          ].toLocaleString()}`;
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = `${lastX}px`;
          tooltipRef.current.style.top = `${lastY + 30}px`; // Position above the last bullet
        }
      }

      // Display the labels below each point
      data.forEach((_, index) => {
        const x = getXPosition(index);
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], x, height - padding + 20);
      });
    }

    drawChart();
  }, [data, labels, hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseX = e.nativeEvent.offsetX;
    let found = false;
    const hoverThreshold = 50; // Adjust this value to change the hover sensitivity

    // Reset hoveredIndex first
    setHoveredIndex(null);

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (canvas.width - 100) + 50; // Adjust for padding
      // Only check horizontal distance
      const distance = Math.abs(x - mouseX);

      if (distance < hoverThreshold) {
        setHoveredIndex(index); // Set the hovered index
        found = true;
      }
    });

    // If no point is found within hoverThreshold, check for mouse leave
    const canvasBounds = canvas.getBoundingClientRect();
    if (
      !found &&
      (e.clientX < canvasBounds.left ||
        e.clientX > canvasBounds.right ||
        e.clientY < canvasBounds.top ||
        e.clientY > canvasBounds.bottom)
    ) {
      setHoveredIndex(data.length - 1); // Keep last index if mouse is outside
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(data.length - 1); // Keep the last point hovered when mouse leaves
  };

  return (
    <div>
      <canvas
        id="lineChartCanvas"
        ref={canvasRef}
        width={600}
        height={400}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ border: "1px solid #ccc" }}
      />
      <div
        id="tooltip"
        ref={tooltipRef}
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "3px",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      />
    </div>
  );
};

export default LineChart;
