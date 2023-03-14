import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class LineChart extends Component {
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
    enableLegend: true,
  };

  componentDidMount() {
    const { data, ...attr } = this.props;
    const element = this.element,
      line = new D3LineChartMulti(element);
    line.render(data, attr);
  }

  componentDidUpdate() {
    const { data, ...attr } = this.props;
    const element = this.element,
      line = new D3LineChartMulti(element);
    line.render(data, attr);
  }

  render() {
    return <svg ref={(element) => (this.element = element)} />;
  }
}

class D3LineChartMulti {
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
      xType,
      yType,
      formatTimeType,
      curveType,
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

    if (xDomain === undefined) xDomain = d3.extent(x);
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
        .y(height - marginBottom);

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
        .style("font-size", "20px")
        .style("font-weight", 550)
        .attr("text-anchor", "middle")
        .style("fill", "currentColor")
        .text(chartTitleText)
    );

    if (strokeColor === undefined) strokeColor = d3.schemeSet2;
    //strokeColor = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1) , newKeys.length);

    const strokeColorScale = d3.scaleOrdinal(newKeys, strokeColor);

    const linePath = svg.append("g"),
      lineNode = svg.append("g");

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
        .data(newKeys)
        .join("circle")
        .attr("class", (d) => "legend_" + d)
        .attr("cx", 0)
        .attr("cy", (_, i) => i * 20 * 1.1)
        .attr("r", 10)
        .attr("fill", (d) => strokeColorScale(d));
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
        linePath.selectAll(".all").style("opacity", 0.2);
        lineNode.selectAll(".all").style("opacity", 0.2);
        linePath.selectAll("._" + d).style("opacity", strokeOpacity);
        lineNode.selectAll("._" + d).style("opacity", strokeOpacity);
      }
    }
    function noHighlight() {
      linePath.selectAll(".all").style("opacity", strokeOpacity);
      lineNode.selectAll(".all").style("opacity", strokeOpacity);
    }
    function selectOne(_, d) {
      selectedOne = true;
      groupData.map((data) => {
        if (!(data.group === d) && !(d === "all")) {
          linePath
            .select("._" + data.group)
            .transition()
            .attr("stroke-width", 0)
            .duration(500);
          lineNode
            .selectAll("._" + data.group)
            .transition()
            .attr("r", 0)
            .duration(500);
        } else if (data.group === d) {
          linePath
            .select("._" + data.group)
            .transition()
            .attr("stroke-width", strokeWidth)
            .duration(500);
          lineNode
            .selectAll("._" + data.group)
            .transition()
            .attr("r", lineNodeRadius)
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
        .attr("stroke-width", strokeWidth)
        .duration(500);
      lineNode
        .selectAll(".all")
        .transition()
        .attr("r", lineNodeRadius)
        .duration(500);
    }
  }
}
