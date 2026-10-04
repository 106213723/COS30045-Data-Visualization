/* ============================================================
   Exercise 6.2 - Interactive scatterplot: tooltips
   Energy use against star rating, coloured by screen technology.
   Hovering a dot shows its screen size and other details, and the
   legend buttons show or hide each technology.
   ============================================================ */

function drawScatterplot(data) {
    const margin = { top: 16, right: 24, bottom: 56, left: 72 };
    const chart = createChart("#scatterplot", 1000, 500, margin);
    const tooltip = createTooltip("#scatterplot");

    const xScale = d3.scaleLinear()
        .domain([0, 8.5])
        .range([0, chart.innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([chart.innerHeight, 0])
        .nice();

    // Star ratings come in half steps, so a small repeatable sideways
    // offset keeps dots at the same rating from hiding each other.
    const jitter = i => ((i * 7919) % 100) / 100 * 0.24 - 0.12;

    addGridLines(chart.inner, yScale, chart.innerWidth);

    // Draw the largest group first so LCD and OLED dots sit on top
    const ordered = data
        .map((d, i) => ({ ...d, jitteredStar: d.star + jitter(i) }))
        .sort((a, b) => TECH_ORDER.indexOf(a.screenTech) - TECH_ORDER.indexOf(b.screenTech));

    chart.inner.selectAll(".dot")
        .data(ordered)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.jitteredStar))
        .attr("cy", d => yScale(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", d => TECH_COLOURS[d.screenTech])
        .attr("fill-opacity", 0.55)
        .on("mouseenter", function () {
            d3.select(this).classed("is-hovered", true).attr("r", 7).attr("fill-opacity", 1).raise();
        })
        .on("mousemove", (event, d) => tooltip.show(event,
            `<strong>${d.brand} ${d.model}</strong>` +
            `Screen size: ${d.screenSize} inches<br>` +
            `Technology: ${d.screenTech}<br>` +
            `Star rating: ${d.star}<br>` +
            `Energy use: ${d.energyConsumption} kWh/year`))
        .on("mouseleave", function () {
            d3.select(this).classed("is-hovered", false).attr("r", 4).attr("fill-opacity", 0.55);
            tooltip.hide();
        });

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(9));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    addAxisTitle(chart.inner, "Star rating (more stars = more efficient)", chart.innerWidth / 2, chart.innerHeight + 46);
    addAxisTitle(chart.inner, "Energy consumption (kWh/year)", -chart.innerHeight / 2, -56, true);

    // Legend buttons double as filters: each one toggles a technology
    const visible = new Set(TECH_ORDER);

    d3.selectAll("#scatter-legend .filter-btn").on("click", function () {
        const tech = this.dataset.tech;
        if (visible.has(tech)) {
            visible.delete(tech);
        } else {
            visible.add(tech);
        }
        d3.select(this).attr("aria-pressed", visible.has(tech));

        chart.inner.selectAll(".dot")
            .style("display", d => (visible.has(d.screenTech) ? null : "none"));
    });
}
