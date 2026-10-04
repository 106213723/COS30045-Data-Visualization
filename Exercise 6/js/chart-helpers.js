/* ============================================================
   Shared chart helpers
   Used by every chart on the page: colours, SVG setup, tooltips
   and axis titles.
   ============================================================ */

// Screen technology colours, always in this order so a technology
// keeps the same colour in every chart.
const TECH_ORDER = ["LED", "LCD", "OLED"];
const TECH_COLOURS = {
    LED: "#167a45",
    LCD: "#c0780f",
    OLED: "#2f6db5"
};

// Creates an SVG with a viewBox inside a chart container and
// returns the inner group plus the drawable width and height.
function createChart(selector, width, height, margin) {
    const svg = d3.select(selector)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const inner = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return {
        svg: svg,
        inner: inner,
        innerWidth: width - margin.left - margin.right,
        innerHeight: height - margin.top - margin.bottom
    };
}

// One tooltip per chart container. show() places it next to the
// pointer and flips it to the left near the right-hand edge.
function createTooltip(selector) {
    const container = d3.select(selector);
    const tip = container.append("div").attr("class", "tooltip");

    return {
        show(event, html) {
            const [x, y] = d3.pointer(event, container.node());
            tip.html(html).classed("show", true);

            const tipWidth = tip.node().offsetWidth;
            const flip = x + 14 + tipWidth > container.node().clientWidth;
            tip.style("left", `${flip ? x - 14 - tipWidth : x + 14}px`)
                .style("top", `${y - 10}px`);
        },
        hide() {
            tip.classed("show", false);
        }
    };
}

// For a rotated (y-axis) title, x and y are measured in the rotated
// frame: x runs up the axis and y runs left of it.
function addAxisTitle(inner, text, x, y, rotate) {
    inner.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("transform", `${rotate ? "rotate(-90) " : ""}translate(${x}, ${y})`)
        .text(text);
}

// Horizontal gridlines behind the data
function addGridLines(inner, yScale, width) {
    inner.append("g")
        .attr("class", "grid-line")
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
}
