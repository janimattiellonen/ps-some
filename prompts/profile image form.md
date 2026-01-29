# Profile image form

Currently the values are hard-coded.

Let's begin with making the following values editable:
- pdga number
- name field (first row with bigger font)
- second row
- third row

All four editable fields are optional and can be left empty. No rules for the fields at the moment.

## Plan

- suggest a modern form library that is typed and supports an external validation library, if needed later on


## Selected tech
- React Hook Form

## Design specifications

- use the component TemplateTest for now
- use flex and create two columns
    - form in the left column
    - image in the right column
- create an accessible form
- use agent wcag-accessibility-auditor to verify accessibility after implementation 


## Uploading an image

Currently a hard-coded image is used. Allow the user to upload a selected photo (png, jpg or jpeg). Set maximum image size to 20Mb. If the user tries to upload an image larger than 20Mb, show an error message below the uoload field in red color. Add a red triangle emoji to make the error message more clear


## Selecting profile template

Currently the image player-profile-green.png is used as the profile template. The directory contains the image player-profile-pink.png, which is nother profile template with pink colors.

In the attached image you can see how I visualize the template selection to look like