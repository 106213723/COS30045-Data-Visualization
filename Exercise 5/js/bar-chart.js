/* ============================================================
   Bar chart: average energy use by screen technology, 55-inch
   TVs only. Holding the size fixed makes the comparison fair.
   ============================================================ */

function drawBarChart(data) {
    const margin = { top: 32, right: 16, bottom: 48, left: 64 };
    const chart = createChart("#bar-chart", 480, 380, margin);
    const tooltip = createTooltip("#bar-chart");

    const tvs55 = data.filter(d => d.screenSize === 55);

    const means = TECH_ORDER.map(tech => {
        const tvs = tvs55.filter(d => d.screenTech === tech);
        return {
            tech: tech,
            models: tvs.length,
            mean: d3.mean(tvs, d => d.energyConsumption)
        };
    });

    // Sort from the highest average energy use to the lowest
    means.sort((a, b) => b.mean - a.mean);

    const xScale = d3.scaleBand()
        .domain(means.map(d => d.tech))
        .range([0, chart.innerWidth])
        .padding(0.35);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(means, d => d.mean)])
        .range([chart.innerHeight, 0])
        .nice();

    addGridLines(chart.inner, yScale, chart.innerWidth);

    chart.inner.selectAll("rect")
        .data(means)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.tech))
        .attr("y", d => yScale(d.mean))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chart.innerHeight - yScale(d.mean))
        .style("fill", d => TECH_COLOURS[d.tech])   // inline style so it wins over the .bar rule
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>55-inch ${d.tech}</strong>` +
            `Average ${d3.format(".1f")(d.mean)} kWh/year<br>${d.models} models`))
        .on("mouseleave", tooltip.hide);

    // Value labels above each bar
    chart.inner.selectAll(".bar-label")
        .data(means)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.tech) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.mean) - 8)
        .attr("text-anchor", "middle")
        .text(d => `${Math.round(d.mean)} kWh`);

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0).tickPadding(10));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(5));

    addAxisTitle(chart.inner, "Average energy use (kWh/year)", -chart.innerHeight / 2, -50, true);
}
