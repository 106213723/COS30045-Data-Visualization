/* ============================================================
   Exercise 6 - load the TV dataset, then draw both charts
   ============================================================ */

d3.csv("data/tv-energy.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    star: +d.star,
    energyConsumption: +d.energyConsumption
})).then(data => {
    drawHistogram(data);
    drawScatterplot(data);
}).catch(error => {
    console.error("Could not load the TV dataset:", error);
    d3.selectAll(".chart").append("p")
        .attr("class", "chart-status")
        .text("The chart data could not be loaded. Open the page through a local server (for example VS Code Live Server).");
});
