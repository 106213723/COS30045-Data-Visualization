/* ============================================================
   Exercise 5.3: donut chart
   Proportion of small, medium and large TV models, from the
   KNIME-aggregated course file.
   ============================================================ */

const drawDonutChart = data => {
    const width = 480;
    const height = 380;
    const padding = 30;
    // Fit the circle inside the shortest side, with room around it
    const radius = Math.min(width, height) / 2 - padding;
    const tooltip = createTooltip("#donut-chart");
    const total = d3.sum(data, d => d.count);

    // Colour scale. The categories have an order (small to large), so
    // they use light to dark shades of one green rather than unrelated hues.
    const colourScale = d3.scaleOrdinal()
        .domain(["small", "medium", "large"])
        .range(["#9fd4b0", "#2fae66", "#005f32"]);

    // Angles for each slice. sort(null) keeps the order of the data,
    // which has already been sorted from small to large.
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)
        .padAngle(0.02)
        .cornerRadius(3);

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Move (0, 0) to the centre so the arcs are drawn around it
    const innerChart = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const slices = innerChart.selectAll(".slice")
        .data(pie(data))
        .join("g")
        .attr("class", "slice");

    slices.append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colourScale(d.data.screenSizeCategory))
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${capitalise(d.data.screenSizeCategory)} TVs</strong>` +
            `${d3.format(",")(d.data.count)} models · ${d3.format(".1%")(d.data.count / total)}`))
        .on("mouseleave", tooltip.hide);

    // Labels in the middle of each slice
    slices.append("text")
        .attr("class", "slice-label")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", d => (d.data.screenSizeCategory === "small" ? "#141d1a" : "#ffffff"))
        .text(d => `${capitalise(d.data.screenSizeCategory)} ${d3.format(".0%")(d.data.count / total)}`);

    // Total in the centre of the ring
    innerChart.append("text")
        .attr("class", "donut-total")
        .attr("text-anchor", "middle")
        .attr("y", -4)
        .text(d3.format(",")(total));

    innerChart.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .text("TV models");
};

function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
