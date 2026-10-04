/* Exercise 4.5 - Binding data and drawing with it
   selectAll().data().join() creates one <rect> per row of data.
   Each bar's width is the brand's count used directly as a pixel
   value, and its y position comes from its index in the array. */

const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

const drawBarChart = data => {
    const barHeight = 20;
    const barSpacing = 5;

    svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        // Step 1: a class linked to each bar's count, e.g. "bar bar-1090"
        .attr("class", d => `bar bar-${d.count}`)
        // Step 2: width from the data, a fixed height and a fill colour
        .attr("width", d => d.count)
        .attr("height", barHeight)
        .attr("fill", "#167a45")
        // Step 3: start every bar at 0 and space them down the y axis
        .attr("x", 0)
        .attr("y", (d, i) => i * (barHeight + barSpacing));
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
        .text(`${data.length} bars drawn, one for each brand.`);
}).catch(error => {
    console.error(error);
    d3.select("#chart-status")
        .text("The CSV could not be loaded. Open this page through a local server, such as VS Code Live Server.");
});
