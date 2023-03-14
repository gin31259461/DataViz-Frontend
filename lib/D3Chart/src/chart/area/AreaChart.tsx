import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class AreaChart extends Component {
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
    /** give format string of time, base on strptime strftime of c standard library */
    timeParse: PropTypes.string,
    /** parse string time to format time, formatTimeType(timeParse)(data) */
    formatTimeType: PropTypes.func,
    /** method of interplate between point */
    curveType: PropTypes.func,
    /** method of x data map */
    xType: PropTypes.func,
    /** method of y data map */
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
    xDomain: PropTypes.arrayOf(PropTypes.number),
    /** domain of y data [start, end] */
    yDomain: PropTypes.arrayOf(PropTypes.number),
    /** domain of x scale range [start, end] */
    xRange: PropTypes.arrayOf(PropTypes.number),
    /** domain of y scale range [start, end] */
    yRange: PropTypes.arrayOf(PropTypes.number),
    /** dot radius */
    lineNodeRadius: PropTypes.number,
    /** line color */
    strokeColor: PropTypes.arrayOf(PropTypes.string),
    /** area color */
    areaColor: PropTypes.arrayOf(PropTypes.string),
    /** area opacity */
    areaOpacity: PropTypes.number, // range [0 - 1]
    /** linecap of line */
    strokeLinecap: PropTypes.string,
    /** linejoin of line */
    strokeLinejoin: PropTypes.string,
    /** line width */
    strokeWidth: PropTypes.number,
    /** line opacity */
    strokeOpacity: PropTypes.number,
    /** chart animation time (ms) */
    animationTime: PropTypes.number,
    /** enable chart animation */
    enableAnimation: PropTypes.bool,
    /** enable dots */
    enableLineNode: PropTypes.bool,
    /** enable to show tip */
    enableTooltip: PropTypes.bool,
    /** enable x-axis */
    enableXAxis: PropTypes.bool,
    /** enable y-axis */
    enableYAxis: PropTypes.bool,
    /** enable line of area */
    enableLinePath: PropTypes.bool,
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
    timeParse: "%Y-%m-%d",
    formatTimeType: d3.timeParse,
    curveType: d3.curveLinear,
    xType: d3.scaleTime,
    yType: d3.scaleLinear,
    marginTop: 40,
    marginRight: 60,
    marginBottom: 20,
    marginLeft: 60,
    xDomain: undefined,
    yDomain: undefined,
    xRange: undefined,
    yRange: undefined,
    lineNodeRadius: 5,
    strokeColor: undefined,
    areaColor: undefined,
    areaOpacity: 0.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
    strokeOpacity: 1,
    animationTime: 1000,
    enableAnimation: true,
    enableLineNode: true,
    enableTooltip: true,
    enableXAxis: true,
    enableYAxis: true,
    enableLinePath: true,
    enableLegend: true,
  };

  componentDidMount() {
    const { data, ...attr } = this.props;
    const element = this.element,
      area = new D3AreaChartGroup(element);
    area.render(data, attr);
  }

  componentDidUpdate() {
    const { data, ...attr } = this.props;
    const element = this.element,
      area = new D3AreaChartGroup(element);
    area.render(data, attr);
  }

  render() {
    return <svg ref={(element) => (this.element = element)} />;
  }
}

class D3AreaChartGroup {
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
      timeParse,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      xDomain,
      yDomain,
      xRange,
      yRange,
      lineNodeRadius,
      strokeColor,
      areaColor,
      xType,
      yType,
      formatTimeType,
      curveType,
      enableLinePath,
      areaOpacity,
      strokeLinecap,
      strokeLinejoin,
      strokeWidth,
      strokeOpacity,
      animationTime,
      enableAnimation,
      enableLineNode,
      enableTooltip,
      enableXAxis,
      enableYAxis,
      enableLegend,
    } = attr;

    if (xRange === undefined) xRange = [marginLeft, width - marginRight];
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    let x = [];
    if (xType === d3.scaleTime)
      x = d3.map(d3.map(data, getX), (d) => formatTimeType(timeParse)(d));

    let rowKeys = [];
    keysOfGroups.forEach((key) => rowKeys.push(key));

    // map groups
    const groupData = rowKeys.map((k) => {
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
    rowKeys.push("all");

    if (xDomain === undefined) xDomain = d3.extent(x);
    if (yDomain === undefined)
      yDomain = [0, d3.max(data, (d) => d3.max(rowKeys, (k) => d[k])) * 1.2];

    const xScale = xType(xDomain, xRange),
      yScale = yType(yDomain, yRange),
      fontSize = (width + height) / 1000 + "em",
      xAxisType = d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0),
      yAxisType = d3.axisLeft(yScale).ticks(height / 40);

    // d: groupData -> value
    const line = d3
        .line()
        .defined((d) => d.defined)
        .curve(curveType)
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y)),
      line0 = d3
        .line()
        .x((d) => xScale(d.x))
        .y(height - marginBottom),
      area0 = d3
        .area()
        .x((d) => xScale(d.x))
        .y0(height - marginBottom)
        .y(height - marginBottom),
      area = d3
        .area()
        .defined((d) => d.defined)
        .curve(curveType)
        .x((d) => xScale(d.x))
        .y0(yScale(0))
        .y1((d) => yScale(d.y));

    if (tooltipTitle === undefined)
      tooltipTitle = (d) => {
        return `group: ${d.group}\nx: ${d3.timeFormat("%Y-%m-%d")(d.x)}\ny: ${
          d.y
        }`;
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
          .append("text")
          .attr("x", width - marginRight)
          .attr("y", 12)
          .attr("style", "12px")
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
        .attr("fill", "currentColor")
        .style("font-size", "20px")
        .style("font-weight", 550)
        .attr("text-anchor", "middle")
        .text(chartTitleText)
    );

    if (areaColor === undefined) areaColor = d3.schemeSet2;
    //areaColor = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1) , rowKeys.length);
    if (strokeColor === undefined) strokeColor = areaColor;

    const areaColorScale = d3.scaleOrdinal(rowKeys, areaColor),
      strokeColorScale = d3.scaleOrdinal(rowKeys, strokeColor);

    const areaPath = svg.append("g"),
      linePath = svg.append("g"),
      lineNode = svg.append("g");

    if (enableLinePath) {
      linePath
        .selectAll("path")
        .data(groupData)
        .join("path")
        .attr("class", (d) => "all _" + d.group)
        .attr("fill", "none")
        .attr("stroke", (d) => strokeColorScale(d.group))
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", (d) => line(d.value));
    }

    areaPath
      .selectAll("path")
      .data(groupData)
      .join("path")
      .attr("class", (d) => "all _" + d.group)
      .attr("fill", (d) => areaColorScale(d.group))
      .style("opacity", areaOpacity)
      .attr("d", (d) => area(d.value));

    if (enableLineNode) {
      const createNode = lineNode.selectAll("circle");
      groupData.map((d, i) => {
        createNode
          .data(d.value)
          .join("circle")
          .attr("class", "all _" + d.group)
          .attr("cx", (d) => xScale(d.x))
          .attr("cy", (d) => yScale(d.y))
          .attr("r", lineNodeRadius)
          .attr("fill", "white")
          .attr("stroke", strokeColorScale(d.group))
          .attr("stroke-width", strokeWidth);
      });
    }

    if (enableTooltip) {
      lineNode
        .selectAll("circle")
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip);
    }

    // animation
    if (enableAnimation) {
      areaPath
        .selectAll("path")
        .attr("fill", "rgba(0, 0, 0, 0)")
        .attr("d", (d) => area0(d.value))
        .transition()
        .attr("fill", (d) => areaColorScale(d.group))
        .attr("d", (d) => area(d.value))
        .duration(animationTime);

      if (enableLinePath) {
        const pathLenth = linePath
          .selectAll("path")
          .nodes()
          .map((node) => node.getTotalLength());
        linePath
          .selectAll("path")
          .data(pathLenth)
          .attr("stroke-dasharray", (d) => d + " " + d)
          .attr("stroke-dashoffset", (d) => d)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(animationTime)
          .delay(animationTime);
      }
      if (enableLineNode) {
        lineNode
          .selectAll("circle")
          .style("opacity", 0)
          .transition()
          .ease(d3.easeLinear)
          .style("opacity", 1)
          .duration(animationTime)
          .delay(animationTime);
      }
    }

    // tooltip
    const tooltip = svg.append("g").style("pointer-events", "none");

    function showTooltip(_, d) {
      tooltip.style("display", null);
      tooltip.attr(
        "transform",
        `translate(${xScale(d.x)}, ${yScale(d.y) - 10})`
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
        .data(rowKeys)
        .join("circle")
        .attr("class", (d) => "legend_" + d)
        .attr("cx", 0)
        .attr("cy", (_, i) => i * 20 * 1.1)
        .attr("r", 10)
        .attr("fill", (d) => areaColorScale(d));
      legend
        .selectAll("text")
        .data(rowKeys)
        .join("text")
        .attr("class", (d) => "legend_" + d)
        .attr("x", 20)
        .attr("y", (_, i) => i * 20 * 1.1 + 4)
        .attr("text-anchor", "start")
        .style("fill", "currentColor")
        .style("font-size", "12px")
        .style("font-weight", 300)
        .text((d) => d);
      setTimeout(() => {
        rowKeys.slice(0, -1).map((d) => {
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
        linePath.selectAll(".all").style("opacity", 0.2);
        lineNode.selectAll(".all").style("opacity", 0.2);
        areaPath.selectAll(".all").style("opacity", 0.2);
        linePath.selectAll("._" + d).style("opacity", strokeOpacity);
        lineNode.selectAll("._" + d).style("opacity", strokeOpacity);
        areaPath.selectAll("._" + d).style("opacity", areaOpacity);
      }
    }
    function noHighlight() {
      linePath.selectAll(".all").style("opacity", strokeOpacity);
      lineNode.selectAll(".all").style("opacity", strokeOpacity);
      areaPath.selectAll(".all").style("opacity", areaOpacity);
    }
    function selectOne(_, d) {
      selectedOne = true;
      groupData.map((data) => {
        if (!(data.group === d) && !(d === "all")) {
          linePath
            .select("._" + data.group)
            .transition()
            .attr("d", line0(data.value))
            .duration(500);
          lineNode
            .selectAll("._" + data.group)
            .transition()
            .attr("cy", yScale(0))
            .attr("r", 0)
            .duration(500);
          areaPath
            .select("._" + data.group)
            .transition()
            .attr("d", area0(data.value))
            .duration(500);
        } else if (data.group === d) {
          linePath
            .select("._" + data.group)
            .transition()
            .attr("d", line(data.value))
            .duration(500);
          lineNode
            .selectAll("._" + data.group)
            .transition()
            .attr("cy", (d) => yScale(d.y))
            .attr("r", lineNodeRadius)
            .duration(500);
          areaPath
            .select("._" + data.group)
            .transition()
            .attr("d", area(data.value))
            .duration(500);
        }
      });
    }
    function selectAll() {
      selectedOne = false;
      linePath
        .selectAll(".all")
        .data(groupData)
        .transition()
        .attr("d", (d) => line(d.value))
        .duration(500);
      lineNode
        .selectAll(".all")
        .transition()
        .attr("cy", (d) => yScale(d.y))
        .attr("r", lineNodeRadius)
        .duration(500);
      areaPath
        .selectAll(".all")
        .transition()
        .attr("d", (d) => area(d.value))
        .duration(500);
    }
  }
}
