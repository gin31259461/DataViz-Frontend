import React from "react";
import Proptypes from "prop-types";
import * as d3 from "d3";
import cloud from "d3-cloud";

export default function WordCloud(props) {
  const svgRef = React.useRef(null);
  const handleLoad = () => {
    const { data, ...attr } = props;
    D3WordCloud(svgRef.current, data, attr);
  };
  React.useEffect(() => {
    handleLoad();
  }, [props]);
  return <svg ref={svgRef} />;
}

WordCloud.propTypes = {
  /** data for wordcloud */
  data: Proptypes.array.isRequired,
  /** function to fetch words data */
  getWord: Proptypes.func,
  /** function to fetch size data */
  getSize: Proptypes.func,
  /** svg width */
  width: Proptypes.number,
  /** svg height */
  height: Proptypes.number,
  /** svg left margin */
  marginLeft: Proptypes.number,
  /** svg right margin */
  marginRight: Proptypes.number,
  /** svg top margin */
  marginTop: Proptypes.number,
  /** svg bottom margin */
  marginBottom: Proptypes.number,
  /** word size range */
  wordSizeRange: Proptypes.arrayOf(Proptypes.number),
  /** words size domain */
  wordSizeDomain: Proptypes.arrayOf(Proptypes.number),
  /** words color range */
  wordColorRange: Proptypes.arrayOf(Proptypes.string),
  /** words color domain */
  wordColorDomain: Proptypes.arrayOf(Proptypes.number),
  /** words rotate value or function */
  rotate: Proptypes.oneOfType([Proptypes.number, Proptypes.func]),
  /** words padding value or function */
  padding: Proptypes.oneOfType([Proptypes.number, Proptypes.func]),
  /** animation time (ms) */
  animationTime: Proptypes.number,
  /** enable animation */
  enableAnimation: Proptypes.bool,
};

WordCloud.defaultProps = {
  getWord: (d) => d.text,
  getSize: (d) => 0.3 + Math.random(),
  width: 600,
  height: 300,
  marginTop: 50,
  marginBottom: 30,
  marginRight: 50,
  marginLeft: 40,
  wordSizeRange: [15, 75],
  wordSizeDomain: [0.5, 2],
  wordColorRange: ["#ace", "#0f0"],
  wordColorDomain: [15, 75],
  rotate: () => (~~(Math.random() * 6) - 3) * 30,
  padding: 3,
  animationTime: 1000,
  enableAnimation: true,
};

function D3WordCloud(
  element,
  data,
  {
    getWord,
    getSize,
    width,
    height,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    wordSizeRange,
    wordSizeDomain,
    wordColorRange,
    wordColorDomain,
    rotate,
    padding,
    animationTime,
    enableAnimation,
  }
) {
  const conTentWidth = width - marginLeft - marginRight;
  const conTentHeight = height - marginTop - marginBottom;
  d3.select(element).selectAll("g").remove();
  const svg = d3.select(element);
  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewbox", [0, 0, width, height])
    .attr("overflow", "visible")
    .append("g")
    .attr(
      "transform",
      `translate(
      ${marginLeft + conTentWidth / 2},
      ${marginTop + conTentHeight / 2})`
    );
  const wordsData = data.map((d) => {
    return {
      text: getWord(d),
      size: getSize(d),
    };
  });
  const wordScale = d3
    .scaleLinear()
    .range(wordSizeRange)
    .domain(wordSizeDomain);
  const colorScale = d3
    .scaleLinear()
    .range(wordColorRange)
    .domain(wordColorDomain);
  const layout = cloud()
    .size([width, height])
    .words(wordsData)
    .rotate(rotate)
    .padding(padding)
    .fontSize((d) => wordScale(d.size))
    .on("end", render);
  layout.start();

  if (enableAnimation) {
    animate();
  }

  function render(words) {
    svg
      .select("g")
      .append("g")
      .selectAll("text")
      .data(words)
      .join("text")
      .attr("font-size", (d) => d.size)
      .style("font-family", "Impact")
      .attr("fill", (d) => colorScale(d.size))
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
      .text((d) => d.text);
  }

  function animate() {
    svg
      .selectAll("text")
      .attr("opacity", 0)
      .transition()
      .attr("opacity", 1)
      .duration(animationTime);
  }
}
