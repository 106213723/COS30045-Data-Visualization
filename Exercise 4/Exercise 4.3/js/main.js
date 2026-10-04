/* Exercise 4.3 - D3 set up
   The D3 code from Exercise 4.2 has been removed. D3 is loaded
   from its CDN before this file, so the global d3 object exists. */

// Confirm D3 has loaded by printing its version on the page
d3.select("#d3-version")
    .text(`D3 version ${d3.version} loaded successfully.`);

// Step 2: create an svg inside the responsive container.
// The viewBox sets a 1200 x 1600 coordinate system that scales with
// the width of the page; the border shows the edge of the canvas.
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Step 3: a hard-coded test rectangle
svg
    .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");
