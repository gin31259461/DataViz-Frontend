import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class ScatterChart extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    /** data for chart */
    data: PropTypes.array.isRequired,
    /** function to fetch x-axis data */
    getX: PropTypes.func,
    /** array to map keys of group */
    keysOfGroups: PropTypes.array,
    /** width of chart */
    width: PropTypes.number,
    /** height of chart */
    height: PropTypes.number,
    /** title of chart */
    chartTitleText: PropTypes.string,
    /** tip text for chart */
    tooltipTitle: PropTypes.func,
    /** x-axis label */
    xAxisText: PropTypes.string,
    /** y-axis label */
    yAxisText: PropTypes.string,
    /** x-axis ticks rotate angle */
    xAxisTicksTextRotation: PropTypes.number, // rotate x axis ticks text, recommend range[30 - 45]
    /** method for x data map */
    xType: PropTypes.func,
    /** method for y data map */
    yType: PropTypes.func,
    /** margin top */
    marginTop: PropTypes.number,
    /** margin right */
    marginRight: PropTypes.number,
    /** margin bottom */
    marginBottom: PropTypes.number,
    /** margin left */
    marginLeft: PropTypes.number,
    /** domain of x data [start, end] */
    /** domain of x data [start, end] */
    xDomain: PropTypes.arrayOf(PropTypes.number),
    /** domain of y data [start, end] */
    yDomain: PropTypes.arrayOf(PropTypes.number),
    /** domain of x scale range [start, end] */
    xRange: PropTypes.arrayOf(PropTypes.number),
    /** domain of y scale range [start, end] */
    yRange: PropTypes.arrayOf(PropTypes.number),
    /** dot radius */
    dotRadius: PropTypes.number,
    dotColor: PropTypes.arrayOf(PropTypes.string),
    /** chart animation time (ms) */
    animationTime: PropTypes.number,
    /** enable chart animation */
    enableAnimation: PropTypes.bool,
    /** enable to show tip */
    enableTooltip: PropTypes.bool,
    /** enable x-axis */
    enableXAxis: PropTypes.bool,
    /** enable y-axis */
    enableYAxis: PropTypes.bool,
    /** enable legend of chart */
    enableLegend: PropTypes.bool,
  };

  static defaultProps = {
    getX: (d) => d.x,
    keysOfGroups: ["y"],
    width: 500,
    height: 300,
    chartTitleText: "",
    tooltipTitle: undefined,
    xAxisText: "",
    yAxisText: "",
    xAxisTicksTextRotation: 0,
    xType: d3.scaleBand,
    yType: d3.scaleLinear,
    marginTop: 40,
    marginRight: 60,
    marginBottom: 20,
    marginLeft: 60,
    xDomain: undefined,
    yDomain: undefined,
    xRange: undefined,
    yRange: undefined,
    dotRadius: 5,
    dotColor: undefined,
    animationTime: 1000,
    enableAnimation: true,
    enableTooltip: true,
    enableXAxis: true,
    enableYAxis: true,
    enableLegend: true,
  };

  componentDidMount() {
    const { data, ...attr } = this.props;
    const element = this.element,
      scatter = new D3ScatterPlotGroup(element);
    scatter.render(data, attr);
  }

  componentDidUpdate() {
    const { data, ...attr } = this.props;
    const element = this.element,
      scatter = new D3ScatterPlotGroup(element);
    scatter.render(data, attr);
  }

  render() {
    return <svg ref={(element) => (this.element = element)} />;
  }
}

class D3ScatterPlotGroup {
  constructor(element) {
    d3.select(element).selectAll("g").remove();
    this.svg = d3.select(element);
  }

  render(data, attr) {
    let {
      getX,
      keysOfGroups,
      width,
      height,
      chartTitleText,
      tooltipTitle,
      xAxisText,
      yAxisText,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      xDomain,
      yDomain,
      xRange,
      yRange,
      dotRadius,
      dotColor,
      xType,
      yType,
      animationTime,
      xAxisTicksTextRotation,
      enableAnimation,
      enabledot,
      enableTooltip,
      enableXAxis,
      enableYAxis,
      enableLegend,
    } = attr;

    if (xRange === undefined) xRange = [marginLeft, width - marginRight];
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    const x = d3.map(data, getX).filter((d) => d != "");

    let newKeys = [];
    keysOfGroups.forEach((key) => newKeys.push(key));

    // map groups
    const groupData = newKeys.map((k) => {
      const newData = [];
      d3.map(data, (d, i) => {
        newData.push({
          x: x[i],
          y: d[k],
          group: k,
          defined: !isNaN(x[i]) && !isNaN(d[k]),
        });
      });
      return { group: k, value: newData };
    });
    newKeys.push("all");

    if (xDomain === undefined) xDomain = x;
    if (yDomain === undefined)
      yDomain = [0, d3.max(data, (d) => d3.max(newKeys, (k) => d[k])) * 1.2];

    const xScale = xType(xDomain, xRange),
      yScale = yType(yDomain, yRange),
      fontSize = (width + height) / 1000 + "em",
      xAxisType = d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0),
      yAxisType = d3.axisLeft(yScale).ticks(height / 40);

    if (tooltipTitle === undefined)
      tooltipTitle = (d) => {
        return `group: ${d.group}\nx: ${d.x}\ny: ${d.y}`;
      };

    const svg = this.svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("overflow", "visible");

    if (enableYAxis) {
      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${marginLeft}, 0)`);
      yAxis
        .call(yAxisType)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", 0)
            .attr("y", marginTop - 12)
            .attr("style", "12px")
            .attr("text-anchor", "start")
            .style("fill", "currentColor")
            .text(yAxisText)
        );
    }

    if (enableXAxis) {
      const xAxis = svg
        .append("g")
        .attr("transform", `translate(0, ${height - marginBottom})`);
      xAxis.call(xAxisType).call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("y2", -(height - marginTop - marginBottom))
          .attr("stroke-opacity", 0.1)
      );
      if (xAxisTicksTextRotation != 0)
        xAxis
          .selectAll("text")
          .attr("text-anchor", "start")
          .attr("transform", (d) => `rotate(${xAxisTicksTextRotation})`);
      xAxis.call((g) =>
        g
          .append("text")
          .attr("x", width - marginRight)
          .attr("y", 12)
          .style("font-size", "12px")
          .style("fill", "currentColor")
          .text(xAxisText)
      );
    }

    const chartTitle = svg.append("g");
    chartTitle.call((g) =>
      g
        .append("text")
        .attr("x", marginLeft + (width - marginRight - marginLeft) / 2)
        .attr("y", marginTop / 2)
        .style("font-size", "20px")
        .style("font-weight", 550)
        .attr("text-anchor", "middle")
        .style("fill", "currentColor")
        .text(chartTitleText)
    );

    if (dotColor === undefined) dotColor = d3.schemeSet2;
    // dotColor = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1) , newKeys.length);

    const dotColorScale = d3.scaleOrdinal(newKeys, dotColor);

    const dot = svg.append("g");

    const createDot = dot.selectAll("circle");
    groupData.map((d, i) => {
      createDot
        .data(d.value)
        .join("circle")
        .attr("class", "all _" + d.group)
        .attr("cx", (d) => xScale(d.x) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d.y))
        .attr("r", dotRadius)
        .attr("fill", dotColorScale(d.group))
        .attr("stroke", "black");
    });

    if (enableTooltip) {
      dot
        .selectAll("circle")
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip);
    }

    // animation
    if (enableAnimation) {
      dot
        .selectAll("circle")
        .attr("r", 0)
        .transition()
        .attr("r", dotRadius)
        .duration(animationTime);
    }

    // tooltip
    const tooltip = svg.append("g").style("pointer-events", "none");

    function showTooltip(_, d) {
      tooltip.style("display", null);
      tooltip.attr(
        "transform",
        `translate(${xScale(d.x) + xScale.bandwidth() / 2}, ${
          yScale(d.y) - 10
        })`
      );

      const path = tooltip
        .selectAll("path")
        .data([,])
        .join("path")
        .attr("fill", "rgba(250, 250, 250, 0.8)")
        .attr("stroke", "rgba(224, 224, 224, 1)")
        .attr("color", "black");

      const text = tooltip
        .selectAll("text")
        .data([,])
        .join("text")
        .style("font-size", fontSize)
        .call((text) =>
          text
            .selectAll("tspan")
            .data(`${tooltipTitle(d)}`.split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (_, i) => `${i * 1.1}em`)
            .attr("font-weight", (_, i) => (i ? null : "bold"))
            .text((d) => d)
        );

      const textBox = text.node().getBBox();
      tooltip.selectAll("path").attr("d", null);
      text.attr(
        "transform",
        `translate(${-textBox.width / 2}, ${-textBox.height + 5})`
      );
      path.attr(
        "d",
        `M${-textBox.width / 2 - 10},5H-5l5,5l5,-5H${textBox.width / 2 + 10}v${
          -textBox.height - 20
        }h-${textBox.width + 20}z`
      );
    }
    function hideTooltip() {
      tooltip.style("display", "none");
    }

    let selectedOne = false;

    // legend
    if (enableLegend) {
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - marginRight + 20}, ${marginTop})`
        )
        .style("cursor", "pointer");
      legend
        .selectAll("circle")
        .data(newKeys)
        .join("circle")
        .attr("class", (d) => "legend_" + d)
        .attr("cx", 0)
        .attr("cy", (_, i) => i * 20 * 1.1)
        .attr("r", 10)
        .attr("fill", (d) => dotColorScale(d));
      legend
        .selectAll("text")
        .data(newKeys)
        .join("text")
        .attr("class", (d) => "legend_" + d)
        .attr("x", 20)
        .attr("y", (_, i) => i * 20 * 1.1 + 4)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", 300)
        .style("fill", "currentColor")
        .text((d) => d);
      setTimeout(() => {
        newKeys.slice(0, -1).map((d) => {
          legend
            .select(".legend_" + d)
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
            .on("click", selectOne);
        });
        legend.select(".legend_all").on("click", selectAll);
      }, animationTime * 2);
    }

    function highlight(_, d) {
      if (!(d === "all") && !selectedOne) {
        dot.selectAll(".all").style("opacity", 0.2);
        dot.selectAll("._" + d).style("opacity", 1);
      }
    }
    function noHighlight() {
      dot.selectAll(".all").style("opacity", 1);
    }
    function selectOne(_, d) {
      selectedOne = true;
      groupData.map((data) => {
        if (!(data.group === d) && !(d === "all")) {
          dot
            .selectAll("._" + data.group)
            .transition()
            .attr("r", 0)
            .duration(500);
        } else if (data.group === d) {
          dot
            .selectAll("._" + data.group)
            .transition()
            .attr("r", dotRadius)
            .duration(500);
        }
      });
    }
    function selectAll() {
      selectedOne = false;
      dot.selectAll(".all").transition().attr("r", dotRadius).duration(500);
    }
  }
}
