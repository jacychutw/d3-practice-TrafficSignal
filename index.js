const colorScale = d3
  .scaleOrdinal()
  .domain(["red", "orange", "green", "black"])
  .range(["#c92216", "#ffcc00", "#22bd22", "#1a1c1a"]);

const svg = d3.select("svg");
const width = svg.attr("width");
const height = svg.attr("height");

svg
  .append("rect")
  .attr("x", 120)
  .attr("y", height / 2 - 50)
  .attr("width", 340)
  .attr("height", 100)
  .attr("rx", 40);

// 加上燈罩
var tunnelvisor = (svg) => {
  const t = svg
    .selectAll("g")
    .data([1, 1, 1])
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(" + (i * 90 + 200) + ",155)";
    });

  t.append("path")
    .data([1, 1, 1])
    .attr("fill", "dimgray")
    .attr(
      "d",
      d3.arc()({
        innerRadius: 40,
        outerRadius: 50,
        startAngle: 1,
        endAngle: -1,
      })
    );
};

const getLight = (type) => ({ type });
const lights = d3.range(3).map(() => getLight("black"));

const render = (selection, props) => {
  const circles = selection.selectAll("circle").data(props.lights);
  circles
    .enter()
    .append("circle")
    .attr("cx", (d, i) => i * 90 + 200)
    .attr("cy", height / 2)
    .attr("r", 40)
    .attr("fill", (d) => colorScale(d.type))
    .merge(circles)
    .attr("fill", (d) => colorScale(d.type));
};

// 設定燈亮與滅
let refreshInterval = "";
let orangeSetTimeout = "";
let redSetTimeout = "";

// 設定每9秒就會循環一次
function refreshIntervalFunc() {
  refreshInterval = setInterval(() => {
    loop();
  }, 9000);
}

// 設定被呼叫過3秒就會切換黃燈
function orangeSetTimeoutFunc() {
  orangeSetTimeout = setTimeout(() => {
    lights[1].type = "orange";
    lights[2].type = "black";
    render(svg, { lights });
    tunnelvisor(svg);
  }, 3000);
}

// 設定被呼叫過5秒就會切換紅燈
function redSetTimeoutFunc() {
  redSetTimeout = setTimeout(() => {
    lights[0].type = "red";
    lights[1].type = "black";
    render(svg, { lights });
    tunnelvisor(svg);
  }, 5000);
}

// 初始化設定燈都是暗的
function init() {
  lights[0].type = "black";
  lights[1].type = "black";
  lights[2].type = "black";
  render(svg, { lights });
  tunnelvisor(svg);
}

function loop() {
  // 一開始設定是綠燈
  lights[0].type = "black";
  lights[1].type = "black";
  lights[2].type = "green";
  render(svg, { lights });
  // 繪製上方帽簷
  tunnelvisor(svg);
  orangeSetTimeoutFunc();
  redSetTimeoutFunc();
}

// 初始化設定
init();

const checkbox = document.querySelector("#checkbox");
checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    //切換到 on，loop重新執行並重新設定循環
    loop();
    refreshIntervalFunc();
  } else {
    //切換到 off，清除循環以及秒數設定，初始化畫面
    clearInterval(refreshInterval);
    clearTimeout(redSetTimeout);
    clearTimeout(orangeSetTimeout);
    init();
  }
});
