import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import { ChartStyle } from "@/chart-style";

interface MapFunctionProps {
  getX: any;
  getY: any;
  getTooltipTitle: any;
}

interface CalendarHeatmapProps extends ChartStyle {
  data: any;
  mapFunction: MapFunctionProps;
  cellSize: number;
  utcParse: string;
  monthParse: string;
  formatUTCTip: string;
  formatDay: any;
  formatTick: string;
  weekday: string;
}

export default function CalendarHeatmap(props: CalendarHeatmapProps) {
  const svgRef = React.useRef(null);

  const handleLoad = () => {
    RemoveCalendarHeatmap(svgRef.current);
    CreateCalendarHeatmap(svgRef.current, props);
  };

  React.useEffect(() => {
    handleLoad();
  }, []);

  return <svg ref={svgRef} />;
}

CalendarHeatmap.propTypes = {
  /** calendar data */
  data: PropTypes.array.isRequired,
  /** give functions to map data*/
  mapFunction: PropTypes.objectOf(PropTypes.func),
  /** chart title */
  title: PropTypes.string,
  /** chart width */
  width: PropTypes.number,
  /** cell colors */
  colors: PropTypes.any,
  /** set chart margins */
  margin: PropTypes.objectOf(PropTypes.number),
  /** heatmap legend settings */
  legend: PropTypes.object,
  /** animation settings */
  animation: PropTypes.object,
  /** cell size */
  cellSize: PropTypes.number,
  /** parse string to format time string */
  utcParse: PropTypes.string,
  /** parse string to format month */
  monthParse: PropTypes.string,
  /** format tooltip time string with utc parse */
  formatUTCTip: PropTypes.string,
  /** week string */
  formatDay: PropTypes.func,
  /** give parse string to format tick string */
  formatTick: PropTypes.any,
  /** first day of week, sunday ? utcSunday : utcMonday | weekday ? 5 : 7 */
  weekday: PropTypes.string,
};

CalendarHeatmap.defaultProps = {
  mapFunction: {
    getX: (d: any) => d.date,
    getY: (d: any) => d.value,
    getTooltipTitle: undefined,
  },
  title: "CalendarHeatmap",
  width: 900,
  margin: {
    top: 65,
    bottom: 0,
    left: 40,
    right: 0,
  },
  colors: undefined,
  legend: {
    title: "frequency",
    enabled: true,
  },
  animation: {
    enabled: true,
    duration: 2000,
  },
  cellSize: 0,
  utcParse: "%Y-%m-%d",
  monthParse: "%b",
  formatUTCTip: "%Y-%m-%d",
  formatDay: (i: number) => "SMTWTFS"[i],
  formatTick: undefined,
  weekday: "sunday",
};

function RemoveCalendarHeatmap(element: any) {
  d3.select(element).selectAll("g").remove();
}

function CreateCalendarHeatmap(element: any, props: CalendarHeatmapProps) {
  let {
    data,
    mapFunction,
    utcParse,
    cellSize,
    formatUTCTip,
    weekday,
    monthParse,
    formatDay,
    formatTick,
    title,
    width,
    margin,
    colors,
    animation,
    legend,
  } = props;

  const x = d3.map(d3.map(data, mapFunction.getX) as [], (d: string) => d3.utcParse(utcParse)(d)) as Date[],
    y = d3.map(d3.map(data, mapFunction.getY), (d) => Number(d)),
    I = d3.range(x.length);

  /**
    utc day
    Sun-Sat
    0-7
  */

  cellSize = (width - margin.top - margin.right) / 53;

  if (mapFunction.getTooltipTitle === undefined)
    mapFunction.getTooltipTitle = (i: number) => `date: ${d3.utcFormat(formatUTCTip)(x[i])}\nvalue: ${y[i]}`;

  const // if sun position no change, mon (weekday also) position fix eg. Mon = 1 => 0
    countDay = weekday === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7,
    timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday,
    weekDays = weekday === "weekday" ? 5 : 7,
    height = cellSize * (weekDays + 2),
    fontSize = (width + height) / 100,
    years = d3.groups(I, (i) => x[i].getFullYear()).reverse();

  if (colors === undefined) colors = d3.interpolateBrBG;

  const max = d3.quantile(y, 0.9975, Math.abs) as number,
    colorScale = d3.scaleSequential([-max, max], colors).unknown("none"),
    formatMonth = d3.utcFormat(monthParse);

  const svg = d3
    .select(element)
    .attr("width", width)
    .attr("height", height * years.length + margin.top + margin.bottom)
    .attr("viewbox", [0, 0, width, height * years.length + margin.top + margin.bottom])
    .attr("overflow", "visible");

  // create year group object
  const year = svg
    .selectAll("g")
    .data(years)
    .join("g")
    .attr("transform", (d, i) => `translate(${margin.left}, ${margin.top + height * i + cellSize * 1.5})`);

  // year group title
  year
    .append("text")
    .attr("x", -5)
    .attr("y", -5)
    .attr("font-size", fontSize)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(([key]) => key);

  // year group month
  year
    .append("g")
    .attr("text-anchor", "end")
    .attr("font-size", fontSize)
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
    .attr("x", -5)
    .attr("y", (i) => (countDay(i) + 0.5) * cellSize)
    .attr("dy", "0.31em")
    .text(formatDay);

  // year group cell
  const cell = year.append("g");
  cell
    .selectAll("rect")
    .data(
      weekday === "weekday"
        ? ([, I]) => I.filter((i) => ![0, 6].includes(x[i].getUTCDay())) // filter Sun Sat
        : ([, I]) => I
    )
    .join("rect")
    .attr("class", (i) => "cell_" + x[i].getUTCMonth())
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr("x", (i) => timeWeek.count(d3.utcYear(x[i]), x[i]) * cellSize + 0.5)
    .attr("y", (i) => countDay(x[i].getUTCDay()) * cellSize + 0.5)
    .attr("fill", (i: number) => colorScale(y[i]) as string);

  // divide each month
  function pathMonth(t: Date) {
    const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
    const w = timeWeek.count(d3.utcYear(t), t);
    return `${
      d === 0
        ? `M${w * cellSize},0`
        : d === weekDays
        ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
    }V${weekDays * cellSize}`;
  }

  // create month object for each year group
  const month = year
    .append("g")
    .selectAll("g")
    .data(([, I]) => d3.utcMonths(d3.utcMonth(x[I[0]]), x[I[I.length - 1]]))
    .join("g");

  // divide each month
  month
    .filter((d, i) => i as any)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 3)
    .attr("d", pathMonth);

  // append months to each year group
  month
    .append("text")
    .attr("x", (d) => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
    .attr("y", -5)
    .attr("font-size", fontSize)
    .text(formatMonth);

  const chartTitle = svg.append("g").call((g) =>
    g
      .append("text")
      .attr("x", margin.left + (width - margin.right - margin.left) / 2)
      .attr("y", margin.top / 2)
      .attr("fill", "black")
      .style("font-size", "20px")
      .style("font-weight", 550)
      .attr("text-anchor", "middle")
      .text(title)
  );

  const tooltip = svg.append("g").attr("pointer-events", "none");

  function showTooltip(_: any, i: number) {
    tooltip.style("display", null);
    const yearIndex = years.findIndex(([key]) => key === x[i].getFullYear());
    tooltip.attr(
      "transform",
      `translate(
        ${margin.left + timeWeek.count(d3.utcYear(x[i]), x[i]) * cellSize + 0.5 + (cellSize - 1) / 2},
        ${margin.top + countDay(x[i].getUTCDay()) * cellSize + 0.5 - 10 + (height * yearIndex + cellSize * 1.5)}
      )`
    );

    const path = tooltip
      .selectAll("path")
      .data([,])
      .join("path")
      .attr("fill", "rgba(250, 250, 250, 0.8)")
      .attr("stroke", "rgba(200, 200, 200, 1)")
      .attr("stroke", "black")
      .attr("color", "black");

    const text = tooltip
      .selectAll("text")
      .data([,])
      .join("text")
      .attr("id", "tooltip-text")
      .style("font-size", fontSize)
      .call((text) =>
        text
          .selectAll("tspan")
          .data(`${mapFunction.getTooltipTitle(i)}`.split(/\n/))
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${i * 1.1}em`)
          .attr("font-weight", (_, i) => (i ? null : "bold"))
          .text((d) => d)
      );

    const textBox = (text.node() as SVGGraphicsElement).getBBox();
    text.attr("transform", `translate(${-textBox.width / 2}, ${-textBox.height + 5})`);
    path.attr(
      "d",
      `M${-textBox.width / 2 - 10},5H-5l5,5l5,-5H${textBox.width / 2 + 10}v${-textBox.height - 20}h-${
        textBox.width + 20
      }z`
    );
  }

  function hideTooltip(_: any, i: number) {
    tooltip.style("display", "none");
  }

  function setToolTop() {
    cell
      .selectAll("rect")
      .on("mouseover.tooltip", showTooltip as any)
      .on("mouseleave.tooltip", hideTooltip as any);
  }

  setToolTop();

  if (animation.enabled) {
    for (let i = 0; i < 11; i++) {
      cell
        .selectAll("rect")
        .data(weekday === "weekday" ? ([, I]) => I.filter((i) => ![0, 6].includes(x[i].getUTCDay())) : ([, I]) => I)
        .attr("fill", "none")
        .attr("width", 0)
        .transition()
        .attr("width", cellSize - 1)
        .attr("fill", (i: number) => colorScale(y[i]) as string)
        .duration(animation.duration);
    }
  }

  // create canvas ramp
  function ramp(color: any, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null) return;
    for (let i = 0; i < n; i++) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  if (legend.enabled) {
    // color scale => new chart_legend x scale
    const chart_legendX = Object.assign(colorScale.copy().interpolator(d3.interpolateRound(0, 200)), {
      range() {
        return [0, 200];
      },
    });

    // chart_legend rect
    const chart_legend = svg.append("g").attr("transform", `translate(10, ${margin.top / 3})`);
    chart_legend
      .append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 200)
      .attr("height", 10)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", () => {
        const canvasElement = ramp(colorScale.interpolator());
        if (canvasElement === undefined) return null;
        return canvasElement.toDataURL();
      });

    const ticks = width / 250,
      n = Math.round(ticks + 1),
      tickValues = d3.range(n).map((i) => d3.quantile(colorScale.domain(), i / (n - 1)));

    const tickFormat = d3.format(formatTick === undefined ? ",.0f" : formatTick);

    // chart_legend axis and title
    chart_legend
      .append("g")
      .attr("transform", `translate(0, 10)`)
      .call(
        d3
          .axisBottom(chart_legendX as any)
          .ticks(ticks, formatTick)
          .tickFormat(tickFormat as any)
          .tickSize(6)
          .tickValues(tickValues as any)
      )
      .call((g) => g.selectAll(".tick line").attr("y1", -10))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", 0)
          .attr("y", -16)
          .attr("fill", "black")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(legend.title)
      );
  }
}
