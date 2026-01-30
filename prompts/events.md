# Events


I need a new page fort designing event posters.

Create a new page file named EventPage. The aim for this new page is to create a poster that looks like the attached image:
- a background image that I can upload
- 1 event title row
- 1 subtitle row (for example for event date)
- 3-4 rows of text that I can edit
- use public/images/templates/oittaa.png as the backgroudn for now

Taking the image more apart:
- the whole image (excluding the text) is covered in a blue transparenbt color. This could be a product of the Event page: user may select the color to be used
- the text has has a geometry shape behind it, with some irregularly placed lines

The above mentioned geometry shape should be recreatable using code. We can then render the geometry shape in code with customizable colors for the shape and the lines.



## Shape changes

In file /Users/janimattiellonen/Documents/Development/Frisbeegolf/puskis-some/src/pages/EventPage.tsx

the geometry shape starts currently way to down. Previously I said it should begin at the height of 300px but I was wrong. It should start at the height of about 75px

## Form

In file /Users/janimattiellonen/Documents/Development/Frisbeegolf/puskis-some/src/pages/EventPage.tsx

Next, it's time to make the contents editable.

Fields:
- title
- subtitle
- 4 rows

All fields are optional. Place club logo (public/images/ps-logo-white.png) on top of all fields.

Use similar concept as with the other forms (PlayerPage and ScoresPage)

