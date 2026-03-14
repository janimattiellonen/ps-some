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

## Multiple variants

The player profile and Competition score forms both have two template to choose from. Create a similar template chooser. Use images public/images/templates:
 - event-blue.png
 - event-pink.png

for the chooser.

In this case, we don't want to use these images in the previerwe component. We just want to use them for the chooser.

However, the selected item determines what background color is to be used for the trapezoid polygon:
- if event-blue.png is selected, use color #1B9AD5, if event-pink.png is selected, use color #EE56A0


## Additional variants

Now we have a new template chooser for events. You can choose between two colors: blue and pink.

Next we need to add a new version where the logo and the texts are placed a bit differently. This new version also comes with different background colors and the possibility to use an overlay.

The new version has the following fields:
- text row 1
- text row 2
- "Show overlay" checkbox

Use images public/images/templates:
 - event-overlay-blue.png
 - event-overlay-pink.png

Use same colors as above.

As we now have two versions of an event with both having 2 or more templates and differing fields, the template selection should be first in the form. Also depending on which version is selected, a different set of form fields are used.

The form needs a version chooser which allows the user to select event version.

### Improvements

The color used in tge selectable overlay are #1B9AD5 or #EE56A0, depending on which template is used.

Additionally there should be a darker overlay over the text (always visible, the overlay checkbox only determine, whether to cover the whole image with pink/blue overlay or not). The attached image shows what it should look like, when the overlay is selected