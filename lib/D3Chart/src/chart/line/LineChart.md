```tsx
let data = [
  {
    M: 284,
    F: 242,
    X: 286,
    date: "2018-02-01",
  },
  {
    M: 154,
    F: 442,
    X: 386,
    date: "2018-02-10",
  },
  {
    M: 243,
    F: 682,
    X: 786,
    date: "2018-02-20",
  },
  {
    M: 484,
    F: 642,
    X: 586,
    date: "2018-02-28",
  },
  {
    M: 584,
    F: 442,
    X: 386,
    date: "2018-03-01",
  },
  {
    M: 384,
    F: 242,
    X: 186,
    date: "2018-03-20",
  },
  {
    M: 254,
    F: 202,
    X: 286,
    date: "2018-03-30",
  },
  {
    M: 184,
    F: 182,
    X: 486,
    date: "2018-04-01",
  },
  {
    M: 154,
    F: 132,
    X: 286,
    date: "2018-04-11",
  },
];

<LineChart
  data={data}
  getX={(d) => d.date}
  keysOfGroups={["M", "F", "X"]}
  chartTitleText={"LineChart"}
  xAxisText={"x"}
  yAxisText={"y"}
  enableLineNode={false}
></LineChart>;
```
