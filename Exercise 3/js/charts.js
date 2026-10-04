/* ============================================================
   Exercise 3 - Television data story charts
   Loads the course TV dataset once and draws the four charts on
   the Televisions page with D3.
   ============================================================ */

const TECH_COLOURS = {
    LED: "#167a45",
    LCD: "#c0780f",
    OLED: "#2f6db5"
};
const TECH_ORDER = ["LED", "LCD", "OLED"];


/* ------------------------------------------------------------
   Shared helpers
   ------------------------------------------------------------ */

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

// One tooltip per chart container. show() places it next to the pointer.
function createTooltip(selector) {
    const container = d3.select(selector);
    const tip = container.append("div").attr("class", "tooltip");

    return {
        show(event, html) {
            const [x, y] = d3.pointer(event, container.node());
            tip.html(html)
                .style("left", `${x + 14}px`)
                .style("top", `${y - 10}px`)
                .classed("show", true);
        },
        hide() {
            tip.classed("show", false);
        }
    };
}

// For a rotated (y-axis) title, x and y are measured in the rotated frame:
// x runs up the axis and y runs left of it.
function addAxisTitle(inner, text, x, y, rotate) {
    inner.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("transform", `${rotate ? "rotate(-90) " : ""}translate(${x}, ${y})`)
        .text(text);
}


/* ------------------------------------------------------------
   Chart 1: histogram of screen sizes
   ------------------------------------------------------------ */
function drawSizeHistogram(data) {
    const margin = { top: 16, right: 16, bottom: 56, left: 64 };
    const chart = createChart("#chart-sizes", 760, 420, margin);
    const tooltip = createTooltip("#chart-sizes");

    // 5-inch bins from 15 to 120 inches
    const bins = d3.bin()
        .value(d => d.screenSize)
        .thresholds(d3.range(15, 121, 5))(data);

    const xScale = d3.scaleLinear()
        .domain([15, 120])
        .range([0, chart.innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([chart.innerHeight, 0])
        .nice();

    chart.inner.append("g")
        .attr("class", "grid-line")
        .call(d3.axisLeft(yScale).tickSize(-chart.innerWidth).tickFormat(""));

    chart.inner.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0) + 1)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr("y", d => yScale(d.length))
        .attr("height", d => chart.innerHeight - yScale(d.length))
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.x0}–${d.x1 - 1} inches</strong>${d.length} televisions`))
        .on("mouseleave", tooltip.hide);

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(6));

    addAxisTitle(chart.inner, "Screen size (inches)", chart.innerWidth / 2, chart.innerHeight + 46);
    addAxisTitle(chart.inner, "Number of televisions", -chart.innerHeight / 2, -48, true);
}


/* ------------------------------------------------------------
   Chart 2: scatter plot of screen size against energy use
   ------------------------------------------------------------ */
function drawSizeEnergyScatter(data) {
    const margin = { top: 16, right: 24, bottom: 56, left: 72 };
    const chart = createChart("#chart-scatter", 1100, 520, margin);
    const tooltip = createTooltip("#chart-scatter");

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.screenSize)])
        .range([0, chart.innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([chart.innerHeight, 0])
        .nice();

    chart.inner.append("g")
        .attr("class", "grid-line")
        .call(d3.axisLeft(yScale).tickSize(-chart.innerWidth).tickFormat(""));

    chart.inner.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.screenSize))
        .attr("cy", d => yScale(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", "var(--primary)")
        .attr("fill-opacity", 0.35)
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.brand} ${d.model}</strong>` +
            `${d.screenSize} inches · ${d.screenTech}<br>${d.energyConsumption} kWh/year`))
        .on("mouseleave", tooltip.hide);

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    addAxisTitle(chart.inner, "Screen size (inches)", chart.innerWidth / 2, chart.innerHeight + 46);
    addAxisTitle(chart.inner, "Energy consumption (kWh/year)", -chart.innerHeight / 2, -56, true);
}


/* ------------------------------------------------------------
   Chart 3: how many models use each technology
   ------------------------------------------------------------ */
function drawTechCount(data) {
    const margin = { top: 8, right: 110, bottom: 24, left: 56 };
    const chart = createChart("#chart-tech-count", 560, 220, margin);

    const counts = TECH_ORDER.map(tech => ({
        tech: tech,
        count: data.filter(d => d.screenTech === tech).length
    }));

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(counts, d => d.count)])
        .range([0, chart.innerWidth]);

    const yScale = d3.scaleBand()
        .domain(TECH_ORDER)
        .range([0, chart.innerHeight])
        .padding(0.3);

    chart.inner.selectAll("rect")
        .data(counts)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => yScale(d.tech))
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => TECH_COLOURS[d.tech]);

    // Direct labels, so the reader does not need to estimate bar length
    chart.inner.selectAll(".bar-label")
        .data(counts)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.count) + 8)
        .attr("y", d => yScale(d.tech) + yScale.bandwidth() / 2)
        .attr("dominant-baseline", "middle")
        .text(d => `${d.count.toLocaleString()} (${d3.format(".0%")(d.count / data.length)})`);

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(8))
        .select(".domain").remove();
}


/* ------------------------------------------------------------
   Chart 4: box plot of screen size for each technology
   ------------------------------------------------------------ */
function drawTechSizeBoxPlot(data) {
    const margin = { top: 8, right: 24, bottom: 48, left: 56 };
    const chart = createChart("#chart-tech-size", 560, 220, margin);
    const tooltip = createTooltip("#chart-tech-size");

    const stats = TECH_ORDER.map(tech => {
        const sizes = data.filter(d => d.screenTech === tech)
            .map(d => d.screenSize)
            .sort(d3.ascending);
        return {
            tech: tech,
            min: sizes[0],
            q1: d3.quantile(sizes, 0.25),
            median: d3.quantile(sizes, 0.5),
            q3: d3.quantile(sizes, 0.75),
            max: sizes[sizes.length - 1]
        };
    });

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(stats, d => d.max)])
        .range([0, chart.innerWidth])
        .nice();

    const yScale = d3.scaleBand()
        .domain(TECH_ORDER)
        .range([0, chart.innerHeight])
        .padding(0.35);

    const box = chart.inner.selectAll(".box")
        .data(stats)
        .join("g")
        .attr("class", "box")
        .attr("transform", d => `translate(0, ${yScale(d.tech)})`)
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.tech}</strong>Median ${d.median}" · middle half ${d.q1}–${d.q3}"<br>` +
            `Range ${d.min}–${d.max}"`))
        .on("mouseleave", tooltip.hide);

    const mid = yScale.bandwidth() / 2;

    // Whisker from smallest to largest model
    box.append("line")
        .attr("class", "box-whisker")
        .attr("x1", d => xScale(d.min))
        .attr("x2", d => xScale(d.max))
        .attr("y1", mid)
        .attr("y2", mid);

    // Box covering the middle 50% of models
    box.append("rect")
        .attr("x", d => xScale(d.q1))
        .attr("width", d => xScale(d.q3) - xScale(d.q1))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => TECH_COLOURS[d.tech]);

    box.append("line")
        .attr("class", "box-median")
        .attr("x1", d => xScale(d.median))
        .attr("x2", d => xScale(d.median))
        .attr("y1", 0)
        .attr("y2", yScale.bandwidth());

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(6));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(8))
        .select(".domain").remove();

    addAxisTitle(chart.inner, "Screen size (inches)", chart.innerWidth / 2, chart.innerHeight + 40);
}


/* ------------------------------------------------------------
   Load the data, then draw every chart
   ------------------------------------------------------------ */
d3.csv("data/data.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    star: +d.star,
    energyConsumption: +d.energyConsumption
})).then(data => {
    drawSizeHistogram(data);
    drawSizeEnergyScatter(data);
    drawTechCount(data);
    drawTechSizeBoxPlot(data);
}).catch(error => {
    console.error("Could not load the TV dataset:", error);
    d3.selectAll(".chart").append("p")
        .attr("class", "chart-status")
        .text("The chart data could not be loaded. Open the page through a local server (for example VS Code Live Server).");
});
