```tsx
let data = [
  {
    count: 2167,
    text: "A",
    detail: "A detail",
  },
  {
    count: 3267,
    text: "B",
    detail: "B detail",
  },
  {
    count: 3167,
    text: "C",
    detail: "C detail",
  },
  {
    count: 5167,
    text: "D",
    detail: "D detail",
  },
];

<Pie
  data={data}
  getX={(d) => d.text}
  keysOfGroups={["count"]}
  getDetail={(d) => d.detail}
  chartTitleText={"Pie"}
></Pie>;
```
