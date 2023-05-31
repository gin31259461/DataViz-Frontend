"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { BarGroup } from "@D3Chart";
import Slider from "../Slider";

const GenerateInfographic = () => {
  const selectedPath = useProjectStore((state) => state.selectedPath);
  console.log(selectedPath);

  let data = [
    {
      "2019": 65,
      "2020": 21,
      month: "January",
    },
    {
      "2019": 8,
      "2020": 48,
      month: "February",
    },
    {
      "2019": 90,
      "2020": 40,
      month: "March",
    },
    {
      "2019": 81,
      "2020": 19,
      month: "April",
    },
    {
      "2019": 56,
      "2020": 96,
      month: "May",
    },
    {
      "2019": 55,
      "2020": 27,
      month: "June",
    },
    {
      "2019": 40,
      "2020": 99,
      month: "July",
    },
  ];
  return (
    <Slider
      components={[
        <BarGroup
          key={0}
          data={data}
          mapper={{
            getX: (d: any) => d.month,
            keys: ["2019", "2020"],
          }}
          base={{
            width: 1000,
            height: 300,
            title: "BarGroup",
            color: undefined,
          }}
        />,
        <BarGroup
          key={1}
          data={data}
          mapper={{
            getX: (d: any) => d.month,
            keys: ["2019", "2020"],
          }}
          base={{
            width: 1000,
            height: 300,
            title: "BarGroup",
            color: undefined,
          }}
        />,
        <BarGroup
          key={2}
          data={data}
          mapper={{
            getX: (d: any) => d.month,
            keys: ["2019", "2020"],
          }}
          base={{
            width: 1000,
            height: 300,
            title: "BarGroup",
            color: undefined,
          }}
        />,
      ]}
    ></Slider>
  );
};

export default GenerateInfographic;
