/* ============================================================
   Donut chart: share of total energy use by screen technology
   Each slice is the combined yearly energy use of every TV with
   that technology, so the slices add up to the whole dataset.
   ============================================================ */

function drawDonutChart(data) {
    const width = 480;
    const height = 380;
    const radius = 150;
    const tooltip = createTooltip("#donut-chart");

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const inner = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const totals = TECH_ORDER.map(tech => {
        const tvs = data.filter(d => d.screenTech === tech);
        return {
            tech: tech,
            models: tvs.length,
            energy: d3.sum(tvs, d => d.energyConsumption)
        };
    });
    const grandTotal = d3.sum(totals, d => d.energy);

    // d3.pie works out the start and end angle of each slice
    const pie = d3.pie()
        .value(d => d.energy)
        .sort(null)
        .padAngle(0.012);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    const labelArc = d3.arc()
        .innerRadius(radius + 22)
        .outerRadius(radius + 22);

    const slices = pie(totals);

    inner.selectAll("path")
        .data(slices)
        .join("path")
        .attr("d", arc)
        .attr("fill", d => TECH_COLOURS[d.data.tech])
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.data.tech}</strong>` +
            `${d3.format(",")(d.data.energy)} kWh/year<br>` +
            `${d3.format(".1%")(d.data.energy / grandTotal)} of the total · ${d.data.models} models`))
        .on("mouseleave", tooltip.hide);

    // Direct labels outside each slice
    inner.selectAll(".slice-label")
        .data(slices)
        .join("text")
        .attr("class", "bar-label slice-label")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", d => (d.startAngle + d.endAngle) / 2 > Math.PI ? "end" : "start")
        .attr("dominant-baseline", "middle")
        .text(d => `${d.data.tech} ${d3.format(".0%")(d.data.energy / grandTotal)}`);

    // Total in the middle of the ring
    inner.append("text")
        .attr("class", "donut-total")
        .attr("text-anchor", "middle")
        .attr("y", -4)
        .text(`${d3.format(".2f")(grandTotal / 1e6)} GWh`);

    inner.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .text("per year, all TVs");
}
