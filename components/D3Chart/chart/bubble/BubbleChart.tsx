import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default class BubbleChart extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    /** data for chart */
    data: PropTypes.array.isRequired,
    /** function to fetch x-axis data */
    getX: PropTypes.func, // function to fetch x-axis data
    /** function to fetch y-axis data */
    getY: PropTypes.func, // function to fetch y-axis data
    /** function to fetch bubble radius data */
    getZ: PropTypes.func, // function to fetch bubbles scale data
    /** function to fetch bubble group data */
    getGroup: PropTypes.func,
    /** function to fetch tooltip text data */
    getTipText: PropTypes.func,
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
    /** bubble radius maximum */
    zMaxRadius: PropTypes.number,
    /** color array to render bubble group */
    color: PropTypes.arrayOf(PropTypes.string),
    /** method if x data map */
    xType: PropTypes.string,
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
    /** domain of z data [start, end] */
    zDomain: PropTypes.arrayOf(PropTypes.number),
    /** scale for x-domain */
    xDomainScale: PropTypes.number,
    /** scale for z-domain */
    zDomainScale: PropTypes.number,
    /** domain of x scale range [start, end] */
    xRange: PropTypes.arrayOf(PropTypes.number),
    /** domain of y scale range [start, end] */
    yRange: PropTypes.arrayOf(PropTypes.number),
    /** domain of z scale range [start, end] */
    zRange: PropTypes.arrayOf(PropTypes.number),
    /** chart animation time (ms) */
    animationTime: PropTypes.number, // ms
    /** enable chart animation */
    enableAnimation: PropTypes.bool,
    /** enable legend of chart */
    enableLegend: PropTypes.bool,
    /** enable x-axis */
    enableXAxis: PropTypes.bool,
    /** enable y-axis */
    enableYAxis: PropTypes.bool,
    enableTooltip: PropTypes.bool,
  };

  static defaultProps = {
    getX: (d) => d.x,
    getY: (d) => d.y,
    getZ: (d) => d.z,
    getGroup: (d) => d.color,
    getTipText: (d) => d.tip,
    width: 500,
    height: 300,
    chartTitleText: "",
    tooltipTitle: undefined,
    xAxisText: "",
    yAxisText: "",
    zMaxRadius: 30,
    color: undefined,
    xType: "scaleLinear",
    marginTop: 40,
    marginRight: 60,
    marginBottom: 60,
    marginLeft: 60,
    xDomain: undefined,
    yDomain: undefined,
    zDomain: undefined,
    xDomainScale: 1,
    zDomainScale: 1,
    xRange: undefined,
    yRange: undefined,
    zRange: undefined,
    animationTime: 2000,
    enableAnimation: true,
    enableLegend: true,
    enableXAxis: true,
    enableYAxis: true,
    enableTooltip: true,
  };

  componentDidMount() {
    const { data, ...attr } = this.props;
    const element = this.element,
      bubble = new D3BubblePlot(element);
    bubble.render(data, attr);
  }

  componentDidUpdate() {
    const { data, ...attr } = this.props;
    const element = this.element,
      bubble = new D3BubblePlot(element);
    bubble.render(data, attr);
  }

  render() {
    return <svg ref={(element) => (this.element = element)} />;
  }
}

class D3BubblePlot {
  constructor(element) {
    d3.select(element).selectAll("g").remove();
    this.svg = d3.select(element);
  }

  render(data, attr) {
    let {
      getX,
      getY,
      getZ,
      getGroup,
      getTipText,
      width,
      height,
      chartTitleText,
      tooltipTitle,
      xAxisText,
      yAxisText,
      zMaxRadius,
      color,
      xType,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      xDomain,
      yDomain,
      zDomain,
      xDomainScale,
      zDomainScale,
      xRange,
      yRange,
      zRange,
      animationTime,
      enableAnimation,
      enableLegend,
      enableXAxis,
      enableYAxis,
      enableTooltip,
    } = attr;

    if (xRange === undefined) xRange = [marginLeft, width - marginRight];
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];
    if (zRange === undefined) zRange = [5, zMaxRadius];

    const x = d3.map(data, getX),
      y = d3.map(data, getY),
      z = d3.map(d3.map(data, getZ), (d) => Number(d)),
      c = d3.map(data, getGroup),
      t = d3.map(data, getTipText),
      cUnique = new d3.InternSet(c),
      I = d3.range(x.length);

    if (xDomain === undefined)
      if (xType === "scaleBand") xDomain = x;
      else if (xType === "scaleLinear") xDomain = [0, d3.max(x) * xDomainScale];

    if (yDomain === undefined) yDomain = [d3.min(y), d3.max(y) * 1.2];
    if (zDomain === undefined) zDomain = [0, d3.max(z) * zDomainScale];

    let xScale = undefined;

    if (xType === "scaleBand") xScale = d3.scaleBand(xDomain, xRange);
    else if (xType === "scaleLinear") xScale = d3.scaleLinear(xDomain, xRange);

    const yScale = d3.scaleLinear(yDomain, yRange),
      zScale = d3.scaleLinear(zDomain, zRange),
      fontSize = (width + height) / 1000 + "em";

    if (color === undefined) color = d3.schemeSet2;
    /*
      color = d3.quantize(
        (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
        cUnique.size
      );
      */
    const cScale = d3.scaleOrdinal().domain(cUnique).range(color);

    if (tooltipTitle === undefined)
      tooltipTitle = (i) =>
        `${t[i]}\n${xAxisText}:${x[i]}\n${yAxisText}:${y[i]}\nscale:${z[i]}`;

    // create svg
    const svg = this.svg
      .attr("width", width)
      .attr("height", height)
      .attr("overflow", "visible")
      .attr("viewBox", [0, 0, width, height]);

    // highlight group
    const highlightGroup = (_, d) => {
      bubbles.selectAll(".bubbles").style("opacity", 0.2);
      bubbles.selectAll("._" + d).style("opacity", 1);
    };
    const noHighlight = (_, d) => {
      bubbles.selectAll(".bubbles").style("opacity", 1);
    };

    // x axis
    if (enableXAxis) {
      const xAxis = svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${height - marginBottom + zMaxRadius})`
        );
      xAxis.call(d3.axisBottom(xScale).tickSizeOuter(0)).call((g) =>
        g
          .append("text")
          .attr("x", width - marginRight)
          .attr("y", 12)
          .attr("fill", "black")
          .attr("style", "12px")
          .text(xAxisText)
      );
    }

    // y axis
    if (enableYAxis) {
      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${marginLeft}, 0)`);
      yAxis
        .call(
          d3
            .axisLeft(yScale)
            .ticks(height / 40)
            .tickSizeOuter(0)
        )
        .call((g) => g.selectAll(".domain").remove())
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
            .attr("fill", "black")
            .attr("style", "12px")
            .attr("text-anchor", "start")
            .text(yAxisText)
        );
    }

    // z circle
    const bubbles = svg.append("g");
    bubbles
      .selectAll("circle")
      .data(I)
      .join("circle")
      .attr("class", (i) => "bubbles _" + c[i] + " bubble_" + x[i])
      .attr("fill", (i) => cScale(c[i]))
      .attr("stroke", "black")
      .attr("stroke-width", "0.5px")
      .attr("cx", (i) => xScale(x[i]))
      .attr("cy", (i) => yScale(y[i]))
      .attr("r", 0);

    if (xType === "scaleBand")
      bubbles
        .selectAll(".bubbles")
        .data(I)
        .attr("cx", (i) => xScale(x[i]) + xScale.bandwidth() / 2);
    else if (xType === "scaleLinear")
      bubbles
        .selectAll(".bubbles")
        .data(I)
        .attr("cx", (i) => xScale(x[i]));

    if (enableTooltip) {
      bubbles
        .selectAll("circle")
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip);
    }

    const chartTitle = svg.append("g");
    chartTitle.call((g) =>
      g
        .append("text")
        .attr("x", marginLeft + (width - marginRight - marginLeft) / 2)
        .attr("y", marginTop / 2)
        .attr("fill", "black")
        .style("font-size", "20px")
        .style("font-weight", 550)
        .attr("text-anchor", "middle")
        .text(chartTitleText)
    );

    // legend
    if (enableLegend) {
      const legend = svg
        .append("g")
        .style("cursor", "pointer")
        .attr(
          "transform",
          `translate(${width - marginRight + 20}, ${marginTop})`
        )
        .selectAll("legend")
        .data(cUnique);
      legend
        .join("circle")
        .attr("cx", 0)
        .attr("cy", (_, i) => i * 20 * 1.1)
        .attr("r", 10)
        .attr("fill", (d) => cScale(d))
        .on("mouseover", highlightGroup)
        .on("mouseleave", noHighlight);
      legend
        .join("text")
        .attr("x", 20)
        .attr("y", (_, i) => i * 20 * 1.1 + 4)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", 300)
        .text((d) => d)
        .on("mouseover", highlightGroup)
        .on("mouseleave", noHighlight);
    }

    // animation
    if (enableAnimation) {
      bubbles
        .selectAll("circle")
        .data(I)
        .transition()
        .duration(animationTime)
        .attr("r", (i) => zScale(z[i]));
    } else {
      bubbles
        .selectAll("circle")
        .data(I)
        .attr("r", (i) => zScale(z[i]));
    }

    // tooltip
    const tooltip = svg.append("g").attr("pointer-events", "none");

    function showTooltip(_, i) {
      tooltip.style("display", null);

      if (xType === "scaleBand")
        tooltip.attr(
          "transform",
          `translate(${xScale(x[i]) + xScale.bandwidth() / 2}, ${
            yScale(y[i]) - zScale(z[i]) - 10
          })`
        );
      else if (xType === "scaleLinear")
        tooltip.attr(
          "transform",
          `translate(${xScale(x[i])}, ${yScale(y[i]) - zScale(z[i]) - 10})`
        );

      const path = tooltip
        .selectAll("path")
        .data([,])
        .join("path")
        .attr("fill", "rgba(250, 250, 250, 0.8)")
        .attr("stroke", "black")
        //.attr("stroke", "rgba(224, 224, 224, 1)")
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
            .data(`${tooltipTitle(i)}`.split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (_, i) => `${i * 1.1}em`)
            .attr("font-weight", (_, i) => (i ? null : "bold"))
            .text((d) => d)
        );

      const textBox = text.node().getBBox();
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
  }
}
