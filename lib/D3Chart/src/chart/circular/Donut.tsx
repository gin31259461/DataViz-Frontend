import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

export default class Donut extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    /** data of this chart*/
    data: PropTypes.array.isRequired,
    /** function to fetch pieces name of pie */
    getX: PropTypes.func,
    /** function to fetch pieces value of pie */
    keysOfGroups: PropTypes.arrayOf(PropTypes.string),
    /** width of this chart */
    width: PropTypes.number,
    /** height of this chart */
    height: PropTypes.number,
    /** pieces domain */
    nameDomain: PropTypes.arrayOf(PropTypes.string),
    /** color array to render pie */
    color: PropTypes.arrayOf(PropTypes.string),
    /** title of this chart */
    chartTitleText: PropTypes.string,
    /** format pieces value of pie */
    format: PropTypes.string, // value format
    /** give function to show tip of pieces of pie */
    tooltipTitle: PropTypes.func,
    /** font size of this chart (em) */
    textSize: PropTypes.number,
    /** margin top */
    marginTop: PropTypes.number,
    /** margin right */
    marginRight: PropTypes.number,
    /** margin bottom */
    marginBottom: PropTypes.number,
    /** margin left */
    marginLeft: PropTypes.number,
    /** inner radius for pie*/
    innerRadius: PropTypes.number,
    /** outer radius for pie*/
    outerRadius: PropTypes.number,
    /** position for label of pie*/
    labelRadius: PropTypes.number,
    /** pie stroke color */
    stroke: PropTypes.string,
    /** pie stroke width */
    strokeWidth: PropTypes.number,
    /** pie stroke line join */
    strokeLinejoin: PropTypes.string,
    /** pie label line color */
    pieLabelStrokeColor: PropTypes.string,
    /** pie label line width */
    pieLabelStrokeWidth: PropTypes.number,
    /** padding angle between consecutive arcs */
    padAngle: PropTypes.number,
    /** animation time of this chart */
    animationTime: PropTypes.number, // ms
    /** enable animation of this chart */
    enableAnimation: PropTypes.bool,
    /** enable label of pie of this chart */
    enablePieLabel: PropTypes.bool,
    /** enable legend of this chart */
    enableLegend: PropTypes.bool,
    enableTooltip: PropTypes.bool,
  };

  static defaultProps = {
    getX: (d) => d.x,
    keysOfGroups: ["y"],
    width: 500,
    height: 300,
    nameDomain: undefined,
    color: undefined,
    chartTitleText: "",
    format: ",.0f",
    tooltipTitle: undefined,
    textSize: undefined,
    marginTop: 40,
    marginRight: 60,
    marginBottom: 40,
    marginLeft: 0,
    innerRadius: undefined,
    outerRadius: undefined,
    labelRadius: undefined,
    stroke: undefined,
    strokeWidth: 2,
    strokeLinejoin: "round",
    pieLabelStrokeColor: "black",
    pieLabelStrokeWidth: 1,
    padAngle: undefined,
    animationTime: 2000, // ms
    enableAnimation: true,
    enablePieLabel: true,
    enableLegend: true,
    enableTooltip: true,
  };

  componentDidMount() {
    const { data, ...attr } = this.props;
    const element = this.element,
      donut = new D3DonutChart(element);
    donut.render(data, attr);
  }

  componentDidUpdate() {
    const { data, ...attr } = this.props;
    const element = this.element,
      donut = new D3DonutChart(element);
    donut.render(data, attr);
  }

  render() {
    return <svg ref={(element) => (this.element = element)} />;
  }
}

class D3DonutChart {
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
      nameDomain,
      color,
      format,
      tooltipTitle,
      innerRadius,
      outerRadius,
      labelRadius,
      stroke,
      strokeWidth,
      strokeLinejoin,
      padAngle,
      chartTitleText,
      animationTime,
      enableAnimation,
      textSize,
      pieLabelStrokeColor,
      pieLabelStrokeWidth,
      enablePieLabel,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      enableLegend,
      enableTooltip,
    } = attr;

    if (outerRadius === undefined)
      outerRadius =
        Math.min(
          width - marginLeft - marginRight,
          height - marginTop - marginBottom
        ) / 2;
    if (innerRadius === undefined) innerRadius = outerRadius * 0.6;
    if (labelRadius === undefined) labelRadius = outerRadius * 1.1;
    if (stroke === undefined) stroke = innerRadius > 0 ? "none" : "white";
    if (padAngle === undefined)
      padAngle = stroke === "none" ? 1 / outerRadius : 0;

    const name = d3.map(data, getX),
      value = d3.map(
        d3.map(data, (d) => d[keysOfGroups[0]]),
        (d) => Number(d)
      );

    // unique set
    if (nameDomain === undefined)
      nameDomain = new d3.InternSet(name.filter((d) => d != ""));

    const I = d3
      .range(name.length)
      .filter((i) => !isNaN(value[i]) && nameDomain.has(name[i]));

    let pieDefined = new Array(I.length),
      fontSize = new String();

    if (textSize === undefined) fontSize = (width + height) / 1000 + "em";
    else fontSize = textSize + "em";

    // title function.
    if (tooltipTitle === undefined) {
      tooltipTitle = (i) => `${name[i]}\n${value[i]}`;
    }

    // Construct arcs.
    // d3.pie()(data); -> divide data to each group
    const divData = d3
      .pie()
      .padAngle(padAngle)
      .sort(null)
      .value((i) => value[i])(I);
    let currentDivData = divData;

    let newName = [];
    name.forEach((key) => newName.push(key));

    newName.push("all");
    I.push(newName.length - 1);

    // Chose a default color scheme based on cardinality.
    if (color === undefined)
      /*
      color = d3.quantize(
        (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
        newName.length
      );
    */
      color = d3.schemeSet2;
    const colorScale = d3.scaleOrdinal(newName, color);

    // d3.arc().innerRadius().outerRadius();
    // innerRadius 內半徑 outerRadius 外半徑
    const arcs = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius),
      arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius),
      pieCentroid = [
        marginLeft + (width - marginLeft - marginRight) / 2,
        marginTop + (height - marginTop - marginBottom) / 2,
      ];

    const svg = this.svg
      .attr("width", width)
      .attr("height", height)
      .attr("overflow", "visible")
      .attr("viewBox", [0, 0, width, height]);

    // construct arc
    const pie = svg
      .append("g")
      .attr("transform", `translate(${pieCentroid})`)
      .attr("stroke", stroke)
      .attr("strokeWidth", strokeWidth)
      .attr("strokeLinejoin", strokeLinejoin);

    function createPie(data) {
      pie
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("class", (d) => "all pie_" + newName[d.data])
        .attr("fill", (d) => colorScale(newName[d.data]))
        .attr("d", arcs);
    }

    function pieAnimation(animationTime) {
      pie
        .selectAll("path")
        .attr("fill", "rgba(0, 0, 0, 0)")
        .transition()
        .attrTween("d", (d) => {
          const f = d3.interpolate(d.startAngle, d.endAngle);
          return (t) => {
            d.endAngle = f(t);
            return arcs(d);
          };
        })
        .attr("fill", (d) => colorScale(newName[d.data]))
        .duration(animationTime);
    }

    function pieTransformAnimation(animationTime) {
      pie
        .selectAll("path")
        .transition()
        .attrTween("d", (d) => {
          const Start = d3.interpolate(
              currentDivData[d.data].startAngle,
              d.startAngle
            ),
            End = d3.interpolate(currentDivData[d.data].endAngle, d.endAngle);
          currentDivData[d.data].startAngle = d.startAngle;
          currentDivData[d.data].endAngle = d.endAngle;
          return (t) => {
            d.startAngle = Start(t);
            d.endAngle = End(t);
            return arcs(d);
          };
        })
        .duration(animationTime);
    }

    createPie(divData);

    const pieLabel = svg
      .append("g")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${pieCentroid})`);

    function pieLabelLine(data) {
      pieLabel
        .selectAll("polyline")
        .data(data)
        .join("polyline")
        .transition()
        .attr("class", (d) => "all pieLabelLine_" + newName[d.data])
        .attr("stroke", "currentColor")
        .style("fill", "none")
        .attr("stroke-width", pieLabelStrokeWidth)
        .attr("points", (d) => {
          if (
            d.endAngle - d.startAngle <
            (Number(fontSize.slice(0, -2)) * 4) / 100
          )
            return [];
          let p1 = arcs.centroid(d),
            p2 = arcLabel.centroid(d),
            p3 = arcLabel.centroid(d),
            midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          p3[0] = labelRadius * 1.05 * (midAngle < Math.PI ? 1 : -1);
          pieDefined[d.data] = true;
          return [p1, p2, p3];
        })
        .duration(500);
    }

    function pieLabelText(data) {
      pieLabel
        .selectAll("text")
        .data(data)
        .join("text")
        .style("font-size", fontSize)
        .style("fill", "currentColor")
        .attr("text-anchor", (d) => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midAngle < Math.PI ? "start" : "end";
        })
        .attr("class", (d) => "all pieLabelText_" + newName[d.data])
        .attr("transform", (d) => {
          let p = arcLabel.centroid(d),
            midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          p[0] = labelRadius * 1.2 * (midAngle < Math.PI ? 1 : -1);
          return `translate(${p})`;
        });
    }

    function pieLabelTspan() {
      pieLabel
        .selectAll("text")
        .selectAll("tspan")
        .data((d) => {
          const lines = `${tooltipTitle(d.data)}`.split(/\n/);
          return d.endAngle - d.startAngle >
            (Number(fontSize.slice(0, -2)) * 4) / 100
            ? lines
            : lines.slice(0, 0);
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => (i ? null : "bold"))
        .text((d) => d);
    }

    if (enablePieLabel) {
      pieLabelLine(divData);
      pieLabelText(divData);
      pieLabelTspan();
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

    // animation
    if (enableAnimation) {
      pieAnimation(animationTime);
      if (enablePieLabel) {
        pieLabel
          .selectAll("polyline")
          .attr("stroke-width", 0)
          .style("stroke", "currentColor")
          .transition()
          .attr("stroke-width", 1)
          .duration(animationTime);
        pieLabel
          .selectAll("tspan")
          .style("fill", "currentColor")
          .transition()
          .textTween((d) => {
            if (isNaN(Number(d))) {
              return (t) => {
                return d;
              };
            }
            const formatValue = d3.format(format);
            const f = d3.interpolate(0, d);
            return (t) => {
              return formatValue(f(t));
            };
          })
          .duration(animationTime);
      }
    }

    // tooltip
    const tooltip = svg.append("g").attr("pointer-events", "none");

    function showTooltip(_, d) {
      const p = arcs.centroid(d);
      tooltip.style("display", null);
      tooltip.attr(
        "transform",
        `translate(${p[0] + pieCentroid[0]}, ${p[1] + pieCentroid[1] - 10})`
      );

      pieLabel.select(".pieLabelText_" + newName[d.data]).style("opacity", 0);
      pieLabel.select(".pieLabelLine_" + newName[d.data]).style("opacity", 0);

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
        .attr("id", "tooltip-text")
        .style("font-size", fontSize)
        .call((text) =>
          text
            .selectAll("tspan")
            .data(`${tooltipTitle(d.data)}`.split(/\n/))
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

    function hideTooltip(_, d) {
      tooltip.style("display", "none");
      pieLabel.select(".pieLabelText_" + newName[d.data]).style("opacity", 1);
      pieLabel.select(".pieLabelLine_" + newName[d.data]).style("opacity", 1);
    }

    function setToolTop() {
      pie
        .selectAll("path")
        .on("mouseover.tooltip", showTooltip)
        .on("mouseleave.tooltip", hideTooltip);
    }

    if (enableTooltip) {
      setTimeout(() => {
        setToolTop();
      }, animationTime);
    }

    // legend
    if (enableLegend) {
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - marginRight + 20}, ${marginTop})`
        );
      legend
        .selectAll("circle")
        .data(I)
        .join("circle")
        .style("cursor", "pointer")
        .attr("class", (i) => "all legend_" + newName[i])
        .attr("cx", 0)
        .attr("cy", (_, i) => i * 20 * 1.1)
        .attr("r", 10)
        .attr("fill", (i) => colorScale(newName[i]));
      legend
        .selectAll("text")
        .data(I)
        .join("text")
        .attr("class", (i) => "all legend_" + newName[i])
        .attr("x", 20)
        .attr("y", (_, i) => i * 20 * 1.1 + 4)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", 300)
        .style("fill", "currentColor")
        .text((i) => newName[i]);
      setTimeout(() => {
        divData.map((d) => {
          legend
            .select(".legend_" + newName[d.data])
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
            .on("click", selectOne);
        });
        legend.select(".legend_all").on("click", selectAll);
      }, animationTime);

      // d -> index
      function highlight(_, i) {
        if (!(newName[i] === "all")) {
          pie.selectAll(".all").style("opacity", 0.2);
          pieLabel.selectAll(".all").style("opacity", 0.2);
          pie.select(".pie_" + newName[i]).style("opacity", 1);
          pieLabel.select(".pieLabelText_" + newName[i]).style("opacity", 1);
          pieLabel.select(".pieLabelLine_" + newName[i]).style("opacity", 1);
        }
      }

      function noHighlight() {
        pie.selectAll(".all").style("opacity", 1);
        pieLabel.selectAll(".all").style("opacity", 1);
      }

      function selectOne(_, i) {
        noHighlight();
        pieDefined[i] = !pieDefined[i];
        if (pieDefined[i] === false)
          legend.selectAll(".legend_" + newName[i]).style("opacity", 0.2);
        else legend.selectAll(".legend_" + newName[i]).style("opacity", 1);
        const newDivData = d3
          .pie()
          .padAngle(padAngle)
          .sort(null)
          .value((i) => value[i])(
          I.slice(0, -1).filter((i) => pieDefined[i] === true)
        );
        createPie(newDivData);
        pieTransformAnimation(500);
        pieLabelLine(newDivData);
        pieLabelText(newDivData);
        pieLabelTspan();
        if (i > 0 && pieDefined[i] === true) {
          currentDivData[i].startAngle = currentDivData[i - 1].endAngle;
          currentDivData[i].endAngle = currentDivData[i - 1].endAngle;
        } else if (i == 0 && pieDefined[i] === true) {
          currentDivData[i].startAngle = 0;
          currentDivData[i].endAngle = 0;
        }
        setTimeout(() => {
          setToolTop();
        }, 500);
      }

      // ******* here have some bug (fixed), but no reason -> divData doesn't work
      function selectAll() {
        pieDefined.map((_, i) => (pieDefined[i] = true));
        legend.selectAll(".all").style("opacity", 1);
        const newDivData = d3
          .pie()
          .padAngle(padAngle)
          .sort(null)
          .value((i) => value[i])(
          I.slice(0, -1).filter((i) => pieDefined[i] === true)
        );
        createPie(newDivData);
        pieTransformAnimation(500);
        pieLabelLine(newDivData);
        pieLabelText(newDivData);
        pieLabelTspan();
        setTimeout(() => {
          setToolTop();
        }, 500);
      }
    }
  }
}
