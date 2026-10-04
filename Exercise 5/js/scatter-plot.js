/* ============================================================
   Scatter plot: energy consumption against star rating
   ============================================================ */

function drawScatterPlot(data) {
    const margin = { top: 16, right: 24, bottom: 56, left: 72 };
    const chart = createChart("#scatter-plot", 1000, 480, margin);
    const tooltip = createTooltip("#scatter-plot");

    const xScale = d3.scaleLinear()
        .domain([0, 8.5])
        .range([0, chart.innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([chart.innerHeight, 0])
        .nice();

    // Star ratings only come in half steps, so many dots would sit on
    // top of each other. A small, repeatable sideways offset (jitter)
    // spreads them out without moving any dot to another rating.
    const jitter = i => ((i * 7919) % 100) / 100 * 0.24 - 0.12;

    addGridLines(chart.inner, yScale, chart.innerWidth);

    chart.inner.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => xScale(d.star + jitter(i)))
        .attr("cy", d => yScale(d.energyConsumption))
        .attr("r", 3.5)
        .attr("fill", "var(--primary)")
        .attr("fill-opacity", 0.3)
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.brand} ${d.model}</strong>` +
            `${d.star} stars · ${d.energyConsumption} kWh/year`))
        .on("mouseleave", tooltip.hide);

    // Mean energy use at each rating, drawn on top as a reference line
    const means = d3.rollups(data, v => d3.mean(v, d => d.energyConsumption), d => d.star)
        .sort((a, b) => a[0] - b[0]);

    chart.inner.append("path")
        .datum(means)
        .attr("fill", "none")
        .attr("stroke", "var(--on-surface)")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1])));

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(9));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    addAxisTitle(chart.inner, "Star rating (more stars = more efficient)", chart.innerWidth / 2, chart.innerHeight + 46);
    addAxisTitle(chart.inner, "Energy consumption (kWh/year)", -chart.innerHeight / 2, -56, true);
}
