/* ============================================================
   Exercise 5 - load the datasets, then draw every chart
   ============================================================ */

Promise.all([
    // Full TV dataset, for the scatter plot and the technology donut
    d3.csv("data/tv-energy.csv", d => ({
        brand: d.brand,
        model: d.model,
        screenSize: +d.screenSize,
        screenTech: d.screenTech,
        star: +d.star,
        energyConsumption: +d.energyConsumption
    })),
    // 5.1: average energy use of 55-inch TVs by screen technology
    d3.csv("data/energy-55inch-by-screen-tech.csv", d => ({
        screenTech: d.screenTech.toUpperCase(),
        energyConsumption: +d.energyConsumption
    })),
    // 5.2: electricity spot prices
    d3.csv("data/spot-prices.csv"),
    // 5.3: number of TVs in each screen size category
    d3.csv("data/screen-size-category-count.csv", d => ({
        screenSizeCategory: d.screenSizeCategory,
        count: +d.count
    }))
]).then(([tvs, energy55, prices, sizeCounts]) => {
    console.log(energy55);
    console.log(sizeCounts);

    // Sort the bars from the highest energy use to the lowest
    energy55.sort((a, b) => b.energyConsumption - a.energyConsumption);

    // The size categories come in alphabetical order (large, medium,
    // small). Sort them by size instead so the donut reads in order.
    const sizeOrder = ["small", "medium", "large"];
    sizeCounts.sort((a, b) => sizeOrder.indexOf(a.screenSizeCategory) - sizeOrder.indexOf(b.screenSizeCategory));

    drawScatterPlot(tvs);
    drawBarChart(energy55);
    drawTechDonut(tvs);
    drawLineChart(prices);
    drawDonutChart(sizeCounts);
}).catch(error => {
    console.error("Could not load the data:", error);
    d3.selectAll(".chart").append("p")
        .attr("class", "chart-status")
        .text("The chart data could not be loaded. Open the page through a local server (for example VS Code Live Server).");
});
