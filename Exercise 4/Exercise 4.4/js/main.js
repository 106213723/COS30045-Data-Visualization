/* Exercise 4.4 - Load data from a CSV file
   d3.csv() reads the file asynchronously and returns a Promise.
   Every value in a CSV arrives as text, so the row conversion
   function turns count into a number with the unary plus (+). */

// Placeholder for the chart. It is built in Exercise 4.5; defining it
// here means the call below works without an error.
const drawBarChart = data => {
    // Code for bar chart goes here (Exercise 4.5)
};

d3.csv("data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count // => converts to number
    };
}).then(data => {
    // Step 3: basic facts about the data set (open the console, F12)
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count)); // => array with min and max

    // Sort from the most models to the fewest
    data.sort((a, b) => b.count - a.count);
    console.log(data);

    showSummary(data);
    showTable(data);
    d3.select("#csv-status")
        .text(`CSV loaded successfully: ${data.length} brands.`);

    // Hand the data to the chart function
    drawBarChart(data);
}).catch(error => {
    console.error(error);
    d3.select("#csv-status")
        .text("The CSV could not be loaded. Open this page through a local server, such as VS Code Live Server.");
});

// The same values that were logged, shown on the page
function showSummary(data) {
    const summary = [
        { label: "data.length", value: data.length },
        { label: "d3.max", value: d3.max(data, d => d.count) },
        { label: "d3.min", value: d3.min(data, d => d.count) },
        { label: "d3.extent", value: `[${d3.extent(data, d => d.count).join(", ")}]` }
    ];

    d3.select("#csv-summary tbody")
        .selectAll("tr")
        .data(summary)
        .join("tr")
        .html(d => `<td><code>${d.label}</code></td><td class="num">${d.value}</td>`);
}

// Every row of the sorted data
function showTable(data) {
    d3.select("#csv-table tbody")
        .selectAll("tr")
        .data(data)
        .join("tr")
        .html((d, i) => `<td class="num">${i + 1}</td><td>${d.brand}</td><td class="num">${d.count}</td>`);
}
