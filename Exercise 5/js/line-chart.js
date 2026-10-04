/* ============================================================
   Line chart: wholesale electricity spot prices, 1998-2024
   The mainland average is the highlighted line; each state is a
   thin grey line behind it for context. Hovering shows every
   value for that year.
   ============================================================ */

const STATES = [
    { key: "Queensland ($ per megawatt hour)", name: "Queensland" },
    { key: "New South Wales ($ per megawatt hour)", name: "New South Wales" },
    { key: "Victoria ($ per megawatt hour)", name: "Victoria" },
    { key: "South Australia ($ per megawatt hour)", name: "South Australia" },
    { key: "Tasmania ($ per megawatt hour)", name: "Tasmania" },
    { key: "Snowy ($ per megawatt hour)", name: "Snowy" }
];

function drawLineChart(rows) {
    const margin = { top: 16, right: 24, bottom: 48, left: 72 };
    const chart = createChart("#line-chart", 1000, 440, margin);
    const tooltip = createTooltip("#line-chart");

    // Blank cells (years with no data for a state) become null
    const toNumber = value => (value === "" ? null : +value);
    const data = rows.map(row => {
        const point = { year: +row.Year, average: toNumber(row["Average Price (notTas-Snowy)"]) };
        STATES.forEach(state => { point[state.name] = toNumber(row[state.key]); });
        return point;
    });

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, chart.innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(STATES, s => d[s.name]))])
        .range([chart.innerHeight, 0])
        .nice();

    addGridLines(chart.inner, yScale, chart.innerWidth);

    const lineFor = key => d3.line()
        .defined(d => d[key] !== null)
        .x(d => xScale(d.year))
        .y(d => yScale(d[key]));

    // Context: one thin line per state
    chart.inner.selectAll(".state-line")
        .data(STATES)
        .join("path")
        .attr("class", "state-line")
        .attr("fill", "none")
        .attr("stroke", "var(--outline)")
        .attr("stroke-opacity", 0.45)
        .attr("stroke-width", 1.25)
        .attr("d", state => lineFor(state.name)(data));

    // Focus: the mainland average
    chart.inner.append("path")
        .attr("fill", "none")
        .attr("stroke", "var(--primary)")
        .attr("stroke-width", 3)
        .attr("d", lineFor("average")(data));

    chart.inner.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chart.innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(13).tickFormat(d3.format("d")));

    chart.inner.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`));

    addAxisTitle(chart.inner, "Spot price ($ per megawatt hour)", -chart.innerHeight / 2, -56, true);

    // Hover: a vertical guide and a dot snap to the nearest year
    const guide = chart.inner.append("line")
        .attr("class", "hover-guide")
        .attr("y1", 0)
        .attr("y2", chart.innerHeight)
        .style("opacity", 0);

    const marker = chart.inner.append("circle")
        .attr("r", 5)
        .attr("fill", "var(--primary)")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .style("opacity", 0);

    chart.inner.append("rect")
        .attr("width", chart.innerWidth)
        .attr("height", chart.innerHeight)
        .attr("fill", "transparent")
        .on("mousemove", event => {
            const [mx] = d3.pointer(event);
            const year = Math.round(xScale.invert(mx));
            const d = data.find(p => p.year === year);
            if (!d) return;

            guide.attr("x1", xScale(year)).attr("x2", xScale(year)).style("opacity", 1);
            marker.attr("cx", xScale(year)).attr("cy", yScale(d.average)).style("opacity", 1);

            const stateRows = STATES
                .filter(s => d[s.name] !== null)
                .map(s => `${s.name}: $${d[s.name]}`)
                .join("<br>");
            tooltip.show(event, `<strong>${year} · average $${d.average}</strong>${stateRows}`);
        })
        .on("mouseleave", () => {
            guide.style("opacity", 0);
            marker.style("opacity", 0);
            tooltip.hide();
        });
}
