/* Exercise 4.2 - Manipulate and add elements with D3
   This file only holds D3 code. The site's own script.js is left
   alone, as the exercise asks. */

// Step 2: select an HTML element and change its style
d3.select("h1")
    .style("color", "green");

// Experimenting with other elements: make every tip in the list bold
d3.selectAll(".demo-item")
    .style("font-weight", "600");

// Step 3: append a paragraph to a <div>.
// A bare d3.select("div") would pick the first <div> on the page,
// which on this site is the navigation bar, so the div is given an id.
d3.select("#demo-box")
    .append("p")
    .attr("class", "body-main")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Step 4: append a rectangle to an <svg>.
// Likewise, d3.select("svg") would pick the menu icon first.
d3.select("#demo-svg")
    .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .style("fill", "green");
