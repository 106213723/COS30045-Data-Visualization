/* Exercise 4.7 - Adding labels
   Each bar and its two labels (brand name and count) sit inside one
   <g> group. The group is moved into place with a translate, so the
   rect and the text inside it only need positions relative to the
   group. */

const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 700")
    .style("border", "1px solid black");

const drawBarChart = data => {
    // Step 1: make room for labels. The bars now start at x = 100,
    // leaving 100 units on the left for the brand names.
    const labelWidth = 100;

    const xScale = d3.scaleLinear()
        .domain([0, 1200])
        .range([0, 400]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, 700])
        .padding(0.2);

    // The old rect selection, kept for reference:
    // svg
    //     .selectAll("rect")
    //     .data(data)
    //     .join("rect")
    //     .attr("class", d => `bar bar-${d.count}`)
    //     .attr("width", d => xScale(d.count))
    //     .attr("height", yScale.bandwidth())
    //     .attr("fill", "#167a45")
    //     .attr("x", 0)
    //     .attr("y", d => yScale(d.brand));

    // Step 2: one group per brand, moved down to that brand's band
    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // Step 3: add the rectangles back. y is 0 because the group's
    // translate already sets the vertical position.
    barAndLabel
        .append("rect")
        .attr("class", d => `bar bar-${d.count}`)
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#167a45")
        .attr("x", labelWidth)
        .attr("y", 0);

    // Step 4: the brand name, right-aligned just left of the bar
    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", labelWidth - 10)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "end")
        .style("font-size", "13px");

    // Step 5: the count, just past the end of the bar
    barAndLabel
        .append("text")
        .text(d => d.count)
        .attr("x", d => labelWidth + xScale(d.count) + 4)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dominant-baseline", "middle")
        .style("font-size", "13px");
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
        .text(`${data.length} labelled bars, one for each brand.`);
}).catch(error => {
    console.error(error);
    d3.select("#chart-status")
        .text("The CSV could not be loaded. Open this page through a local server, such as VS Code Live Server.");
});
