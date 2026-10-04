/* ============================================================
   Exercise 5.1: vertical bar chart with axes
   Average energy use of 55-inch TVs for each screen technology,
   from the KNIME-aggregated course file. Holding the size fixed
   makes the comparison between technologies fair.
   ============================================================ */

const drawBarChart = data => {
    const margin = { top: 32, right: 16, bottom: 48, left: 64 };
    const chart = createChart("#bar-chart", 480, 380, margin);
    const tooltip = createTooltip("#bar-chart");

    // Scales: categories on the x axis, energy use on the y axis
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.screenTech))
        .range([0, chart.innerWidth])
        .padding(0.35);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([chart.innerHeight, 0])
        .nice();

    addGridLines(chart.inner, yScale, chart.innerWidth);

    // Bars. The y scale runs top to bottom, so each bar's height is the
    // distance from its top (yScale value) down to the bottom of the chart.
    chart.inner.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.screenTech))
        .attr("y", d => yScale(d.energyConsumption))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chart.innerHeight - yScale(d.energyConsumption))
        .style("fill", d => TECH_COLOURS[d.screenTech])   // inline style so it wins over the .bar rule
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>55-inch ${d.screenTech}</strong>` +
            `Average ${d3.format(".1f")(d.energyConsumption)} kWh/year`))
        .on("mouseleave", tooltip.hide);

    // Value labels above each bar
    chart.inner.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.screenTech) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.energyConsumption) - 8)
        .attr("text-anchor", "middle")
        .text(d => `${Math.round(d.energyConsumption)} kWh`);

    // Axes
    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0).tickPadding(10));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(5));

    addAxisTitle(chart.inner, "Average energy use (kWh/year)", -chart.innerHeight / 2, -50, true);
};
