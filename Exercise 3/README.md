# Exercise 3: Data Story, TV Energy Consumption

This is my Exercise 0.2 website with the Televisions page turned into a data
story. The chart placeholders are now real charts made from the TV dataset.

## Audience

People in Australia shopping for a new TV who want to know how screen size and
screen type affect how much electricity it uses.

## Main question

How much does screen size affect how much energy a TV uses?

## Story overview

The Televisions page has three chapters.

1. **What sizes are most common.** A histogram of screen sizes. 55 and 65 inch
   TVs are the most common, about a third of the dataset between them.
2. **Bigger screens use more energy.** A scatter plot of screen size against
   energy use. The link is strong (r = 0.86). An average 32 inch TV uses about
   119 kWh a year and a 98 inch TV about 1,179 kWh.
3. **Does screen type matter.** A bar chart of how many TVs use LED, LCD and
   OLED, and a box plot of their screen sizes. OLED TVs use more energy on
   average, but they are also usually bigger, so the comparison needs care.

The page ends with key takeaways and a recommendation for buyers.

## About the data

### Data source

The TV dataset from the unit materials. It has 4,233 TVs with brand, model,
screen size, screen type, star rating and energy use in kWh per year.

### Data processing

I used the dataset as it was given and did not remove any rows. When the page
loads, D3 turns the number columns from text into numbers, then groups the TVs
into 5 inch size bands and by screen type for the charts.

### Privacy

There is no personal information in the data. It is only product details.

### Accuracy and limitations

- The energy figures come from standard label tests. Real use depends on
  settings, brightness and how long the TV is on.
- The dataset might not include every TV on sale.
- The charts show that size and energy use go together. They do not prove
  size is the only cause.

### Ethics

Every chart axis starts at zero so differences are not exaggerated, and no
brand is singled out or promoted.

## AI declaration

I used Claude (Anthropic) to write the D3 code for the charts, work out the
numbers quoted in the story and help draft this README. I checked the charts
against the data and tested everything in the browser before adding it.

## How to run it

The charts load a CSV file, so open the site with Live Server in VS Code.
Opening the HTML file directly will not load the data.
