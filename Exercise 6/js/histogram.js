/* ============================================================
   Exercise 6.1 - Interactive histogram: filtering
   The histogram is drawn once, then updated whenever a filter
   button is pressed. Bars animate to their new heights, and the
   y axis rescales so the smaller groups stay readable.
   ============================================================ */

const ALL_COLOUR = "#49554f";       // neutral colour for "All", so it is not mistaken for LED

function drawHistogram(data) {
    const margin = { top: 16, right: 24, bottom: 56, left: 72 };
    const chart = createChart("#histogram", 1000, 440, margin);
    const tooltip = createTooltip("#histogram");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : 600;

    // The x axis stays the same for every filter, so the groups can be
    // compared position for position.
    const xScale = d3.scaleLinear()
        .domain([0, 2700])
        .range([0, chart.innerWidth]);

    const binner = d3.bin()
        .value(d => d.energyConsumption)
        .domain(xScale.domain())
        .thresholds(d3.range(0, 2701, 100));

    const yScale = d3.scaleLinear()
        .range([chart.innerHeight, 0]);

    const grid = chart.inner.append("g").attr("class", "grid-line");
    const barsLayer = chart.inner.append("g");

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(14));

    const yAxis = chart.inner.append("g").attr("class", "axis");

    addAxisTitle(chart.inner, "Energy consumption (kWh/year), in 100 kWh bins", chart.innerWidth / 2, chart.innerHeight + 46);
    addAxisTitle(chart.inner, "Number of televisions", -chart.innerHeight / 2, -56, true);

    function update(tech) {
        const subset = tech === "All" ? data : data.filter(d => d.screenTech === tech);
        const bins = binner(subset);
        const colour = tech === "All" ? ALL_COLOUR : TECH_COLOURS[tech];

        yScale.domain([0, d3.max(bins, d => d.length)]).nice();

        grid.transition().duration(duration)
            .call(d3.axisLeft(yScale).tickSize(-chart.innerWidth).tickFormat(""));
        yAxis.transition().duration(duration)
            .call(d3.axisLeft(yScale));

        barsLayer.selectAll("rect")
            .data(bins)
            .join(
                enter => enter.append("rect")
                    .attr("x", d => xScale(d.x0) + 1)
                    .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
                    .attr("y", chart.innerHeight)
                    .attr("height", 0)
            )
            .on("mousemove", (event, d) => tooltip.show(event,
                `<strong>${d.x0}–${d.x1} kWh/year</strong>` +
                `${d.length} ${tech === "All" ? "" : tech + " "}televisions`))
            .on("mouseleave", tooltip.hide)
            .transition().duration(duration)
            .attr("fill", colour)
            .attr("y", d => yScale(d.length))
            .attr("height", d => chart.innerHeight - yScale(d.length));

        // A short written summary of the current selection
        const median = d3.median(subset, d => d.energyConsumption);
        d3.select("#histogram-summary").html(
            `Showing <strong>${subset.length.toLocaleString()}</strong> ` +
            `${tech === "All" ? "televisions" : tech + " televisions"} · ` +
            `median <strong>${Math.round(median)} kWh/year</strong>`);
    }

    // Filter buttons: only one can be pressed at a time
    d3.selectAll("#histogram-filters .filter-btn").on("click", function () {
        const tech = this.dataset.tech;
        d3.selectAll("#histogram-filters .filter-btn").attr("aria-pressed", "false");
        d3.select(this).attr("aria-pressed", "true");
        update(tech);
    });

    update("All");
}
