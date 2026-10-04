/* Exercise 4.6 - Scaling charts
   The viewBox is now only 500 wide, narrower than the largest count,
   so raw counts would run off the edge. Scales map data values (the
   domain) onto positions that fit the svg (the range). */

// Narrow canvas; height reduced from 1600 so the chart is not too long
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 700")
    .style("border", "1px solid black");

const drawBarChart = data => {
    // Step 1: linear scale for the counts (continuous data).
    // The domain reaches a little past the largest count; the range
    // stops at 400, leaving room for labels in Exercise 4.7.
    const xScale = d3.scaleLinear()
        .domain([0, 1200])
        .range([0, 400]);

    // Step 3: band scale for the brands (categorical data).
    // Padding leaves a gap between the bars.
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, 700])
        .padding(0.2);

    // barHeight and barSpacing are no longer needed:
    // const barHeight = 20;
    // const barSpacing = 5;

    svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", d => `bar bar-${d.count}`)
        .attr("width", d => xScale(d.count))   // Step 2: width from the scale
        .attr("height", yScale.bandwidth())     // thickness from the band scale
        .attr("fill", "#167a45")
        .attr("x", 0)
        .attr("y", d => yScale(d.brand));      // position from the band scale
};

d3.csv("data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count
    };
}).then(data => {
    data.sort((a, b) => b.count - a.count);
    drawBarChart(data);

    d3.select("#chart-status")
        .text(`${data.length} bars scaled to fit a 500 x 700 viewBox.`);
}).catch(error => {
    console.error(error);
    d3.select("#chart-status")
        .text("The CSV could not be loaded. Open this page through a local server, such as VS Code Live Server.");
});
