import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default function LiquidFillGauge(props) {
  const svgRef = React.useRef(null);

  const handleLoad = () => {
    const { ...attr } = props;
    D3LiquidFillGauge(svgRef.current, attr);
  };

  React.useEffect(() => {
    handleLoad();
  }, [props]);

  return <svg ref={svgRef} />;
}

LiquidFillGauge.propTypes = {
  /** 輸入資料 */
  value: PropTypes.number.isRequired,
  /** SVG 寬 */
  width: PropTypes.number,
  /** SVG 高 */
  height: PropTypes.number,
  /** 最小值 */
  minValue: PropTypes.number,
  /** 最大值 */
  maxValue: PropTypes.number,
  /** 圓的外厚度 (0-1) */
  circleThickness: PropTypes.number,
  /** 圓的邊界(0-1) */
  circleFillGap: PropTypes.number,
  /** 外圍圓的顏色 */
  circleColor: PropTypes.string,
  /** 水波高度(0-1) */
  waveHeight: PropTypes.number,
  /** 水波數量 */
  waveCount: PropTypes.number,
  /** 水波上升速度 */
  waveRiseTime: PropTypes.number,
  /** 水波移動速度 */
  waveAnimateTime: PropTypes.number,
  /** 水波是否上升 */
  waveRise: PropTypes.bool,
  /** 在最高值水波是否縮放 */
  waveHeightScaling: PropTypes.bool,
  /** 水波是否移動 */
  waveAnimate: PropTypes.bool,
  /** 水波的的顏色  */
  waveColor: PropTypes.string,
  /** 水波的偏移量(0-1) */
  waveOffset: PropTypes.number,
  /** 文字的所在位置(0-1) */
  textVertPosition: PropTypes.number,
  /** 文字所顯示的相對高度 1=半徑高  */
  textSize: PropTypes.number,
  /** 文字是否有上升變化 */
  valueCountUp: PropTypes.bool,
  /** 是否顯示 % 單位 */
  displayPercent: PropTypes.bool,
  /** 文字的顏色的的顏色 */
  textColor: PropTypes.string,
  /** 文字在水中的顏色 */
  waveTextColor: PropTypes.string,
};

LiquidFillGauge.defaultProps = {
  value: 50,
  width: 150,
  height: 200,
  minValue: 0,
  maxValue: 100,
  circleThickness: 0.05,
  circleFillGap: 0.05,
  circleColor: "#178BCA",
  waveHeight: 0.1,
  waveCount: 1,
  waveRiseTime: 2000,
  waveAnimateTime: 2000,
  waveRise: true,
  waveHeightScaling: true,
  waveAnimate: true,
  waveColor: "#178BCA",
  waveOffset: 0,
  textVertPosition: 0.9,
  textSize: 0.5,
  valueCountUp: true,
  displayPercent: true,
  textColor: "#045681",
  waveTextColor: "#A4DBf8",
};

function D3LiquidFillGauge(
  element,
  {
    value,
    width,
    height,
    minValue,
    maxValue,
    circleThickness,
    circleFillGap,
    circleColor,
    waveHeight,
    waveCount,
    waveRiseTime,
    waveAnimateTime,
    waveRise,
    waveHeightScaling,
    waveAnimate,
    waveColor,
    waveOffset,
    textVertPosition,
    textSize,
    valueCountUp,
    displayPercent,
    textColor,
    waveTextColor,
  }
) {
  const gauge = d3.select(element);
  gauge.selectAll("g").remove();
  const radius = Math.min(width, height) / 2 - 10;
  const locationX = width / 2 - radius;
  const locationY = height / 2 - radius;
  const fillPercent =
    Math.max(minValue, Math.min(maxValue, value)) /
    maxValue;

  const waveHeightScale = waveHeightScaling
    ? d3.scaleLinear().range([0, waveHeight], 0).domain([0, 50, 100])
    : d3
        .scaleLinear()
        .range([waveHeight, waveHeight])
        .domain([0, 100]);

  const textPixels = (textSize * radius) / 2;
  const textFinalValue = parseFloat(value).toFixed(2);
  const textStartValue = valueCountUp
    ? minValue
    : textFinalValue;
  const percentText = displayPercent ? "%" : "";
  circleThickness = circleThickness * radius;
  circleFillGap = circleFillGap * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;
  waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
  const waveLength = (fillCircleRadius * 2) / waveCount;
  const waveClipCount = 1 + waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  let textRounder = (v) => Math.round(v);
  let rand = Math.random();
  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = (v) => parseFloat(v).toFixed(1);
  }
  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = (v) => parseFloat(v).toFixed(2);
  }

  let data = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push({
      x: i / (40 * waveClipCount),
      y: i / 40,
    });
  }

  const gaugeCircleX = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, 1]);
  const gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

  const waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const waveRiseScale = d3
    .scaleLinear()
    .range([
      fillCircleMargin + fillCircleRadius * 2 + waveHeight,
      fillCircleMargin - waveHeight,
    ])
    .domain([0, 1]);
  const waveAnimateScale = d3
    .scaleLinear()
    .range([0, waveClipWidth - fillCircleRadius * 2]);

  const textRiseScaleY = d3
    .scaleLinear()
    .range([
      fillCircleMargin + fillCircleRadius * 2,
      fillCircleMargin + textPixels * 0.7,
    ])
    .domain([0, 1]);

  const gaugeGroup = gauge
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${locationX},${locationY})`);

  const gaugeCircleArc = d3
    .arc()
    .startAngle(gaugeCircleX(0))
    .endAngle(gaugeCircleX(1))
    .outerRadius(gaugeCircleY(radius))
    .innerRadius(gaugeCircleY(radius - circleThickness));

  gaugeGroup
    .append("path")
    .attr("d", gaugeCircleArc)
    .style("fill", circleColor)
    .attr("transform", `translate(${radius},${radius})`);

  const text = gaugeGroup
    .append("text")
    .text(textRounder(textStartValue) + percentText)
    .attr("class", "liquidFillGaugeText")
    .attr("text-anchor", "middle")
    .attr("font-size", `${textPixels}px`)
    .style("fill", textColor)
    .attr(
      "transform",
      `translate(${radius},${textRiseScaleY(textVertPosition)})`
    );
  const clipArea = d3
    .area()
    .x((d) => waveScaleX(d.x))
    .y0((d) =>
      waveScaleY(
        Math.sin(
          Math.PI * 2 * waveOffset * -1 +
            Math.PI * 2 * (1 - waveCount) +
            d.y * 2 * Math.PI
        )
      )
    )
    .y1((d) => fillCircleRadius * 2 + waveHeight);
  const waveGroup = gaugeGroup
    .append("defs")
    .append("clipPath")
    .attr("id", `clipWave${rand}`);
  const wave = waveGroup
    .append("path")
    .datum(data)
    .attr("d", clipArea)
    .attr("T", 0);
  const fillCircleGroup = gaugeGroup
    .append("g")
    .attr("clip-path", `url(#clipWave${rand})`);
  fillCircleGroup
    .append("circle")
    .attr("cx", radius)
    .attr("cy", radius)
    .attr("r", fillCircleRadius)
    .style("fill", waveColor);
  const text2 = fillCircleGroup
    .append("text")
    .text(textRounder(textStartValue) + percentText)
    .attr("class", "liquidFillGaugeText")
    .attr("text-anchor", "middle")
    .attr("font-size", `${textPixels}px`)
    .style("fill", waveTextColor)
    .attr(
      "transform",
      `translate(${radius},${textRiseScaleY(textVertPosition)})`
    );
  if (valueCountUp) {
    const textTween = function() {
      const i = d3.interpolate(this.textContent, textFinalValue);

      return (t) => {
        this.textContent = textRounder(i(t)) + percentText;
      };
    };
    text.transition().duration(waveRiseTime).tween("text", textTween);
    text2.transition().duration(waveRiseTime).tween("text", textTween);
  }
  const waveGroupXPosition =
    fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;

  if (waveRise) {
    waveGroup
      .attr("transform", `translate(${waveGroupXPosition},${waveRiseScale(0)})`)
      .transition()
      .duration(waveRiseTime)
      .attr(
        "transform",
        `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`
      );
  } else {
    waveGroup.attr(
      "transform",
      `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`
    );
  }
  function animateWave() {
    wave.attr(
      "transform",
      "translate(" + waveAnimateScale(wave.attr("T")) + ",0)"
    );
    wave
      .transition()
      .duration(waveAnimateTime * (1 - wave.attr("T")))
      .ease(d3.easeLinear)
      .attr("transform", "translate(" + waveAnimateScale(1) + ",0)")
      .attr("T", 1)
      .on("end", function () {
        wave.attr("T", 0);
        animateWave(waveAnimateTime);
      });
  }
  if (waveAnimate) {
    animateWave();
  }
}