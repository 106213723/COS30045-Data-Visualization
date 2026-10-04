# Appliance Energy Consumption Website

My website for COS30045 Exercise 0.2. It's three pages about how much
electricity household appliances use, built with HTML, CSS and JavaScript.
No frameworks or libraries.

## Pages

- `index.html` - Home. Intro section and a FAQ accordion.
- `televisions.html` - Televisions. Set up as a data story with placeholders
  where the charts will go later.
- `about.html` - About Us. Info about the project and the data.

## How to run it

Open `index.html` in a browser. That's it, there's nothing to install.
I used the Live Server extension in VS Code while working on it.

## Folder structure

```
css/
    styles.css
js/
    scripts.js
images/
    PowerIcon.png
data/
    data.csv
index.html
televisions.html
about.html
README.md
```

All the CSS is in one file and all the JavaScript is in one file. Both are
linked from every page so the styling stays the same across the site.

## What it does

- Nav bar on all three pages with the power logo top left
- Logo takes you back to Home
- Links change colour when you hover over them
- The page you're on is underlined in the nav
- FAQ answers are hidden until you click the question
- Footer year updates itself
- Nav collapses into a menu button on phones

## The JavaScript

`js/scripts.js` runs on all three pages. Each bit checks the elements
exist first, otherwise you get errors on pages that don't have them.

**Footer year.** Grabs the span with id "year" and puts the current year in it
with `new Date().getFullYear()`. Saves me updating it manually.

**FAQ accordion.** `querySelectorAll` grabs all the question buttons, then
`forEach` loops through and adds a click listener to each one.
`nextElementSibling` gets the answer div sitting right under the button, and
`classList.toggle("show")` adds or removes the class. The CSS has
`.faq-answer { display: none }` and `.faq-answer.show { display: block }`, so
JavaScript only handles the state and CSS does the showing and hiding.

**Menu button.** Same toggle idea, adds an "open" class to the nav list.

## Colours

Greens based on the power logo. They're set as CSS variables at the top of
styles.css so I only have to change them in one place.

- `#167a45` buttons, links, active nav
- `#005f32` the site name
- `#f7f9f8` page background
- `#ffffff` cards
- `#dde4e0` borders

Fonts are Hanken Grotesk for headings and Source Sans 3 for body text, loaded
from Google Fonts with fallbacks in case they don't load.

## Generative AI Reflection

**Tools.** I used Claude and Google Stitch.

**What I used it for.** Stitch to come up with the visual design, and Claude to
help with the CSS and to explain things I didn't understand.

**What I changed.** The design Stitch gave me used Tailwind from a CDN and an
icon font from Google. The exercise says all the styling has to be in an
external CSS file and I can't use libraries, so I couldn't use that code. I
rebuilt the design in normal CSS instead. The colours and sizes from the mockup
became CSS variables, and I swapped the icon font for SVG icons written
directly in the HTML.

**What I learnt.** How `addEventListener` connects a click to a function, and
that it's cleaner to let JavaScript just toggle a class and let CSS decide what
that class looks like. I also learnt how CSS grid placement works after getting
stuck on a bug where a section collapsed into one narrow column. Turned out
`grid-column: span 8` sets the end line to auto, so adding a separate start
line afterwards broke it. Had to set both lines in one rule.

**Problems.** Code still has to be checked and tested. A lot of what I got back was more complicated than the exercise and I had issues with doing graphs but I debugged them one by one to find the solution. 
