# William Kapinga | ICT251 Portfolio

A responsive personal portfolio built with HTML, CSS, and JavaScript for ICT251 Web Technologies. The website retains my personal introduction, hobbies, learning plan, photos, recordings, and contact form, and adds interactive features.

## JavaScript features

1. **Contact form validation and email draft:** checks the name, email, and message; reports problems beside the relevant fields; displays a safe local preview; and opens a prefilled email draft addressed to the site owner. The visitor reviews and sends it in their email app.
2. **Theme switch:** switches between dark and light colour themes.
3. **Photo gallery:** Previous and Next buttons move through eight captioned photos and wrap at the beginning and end.
4. **Project and skill filter:** filters three learning examples, has a reset button, and explains when there are no matches. Each project card also opens its details.

## Add a new project

This is a static site, so visitors cannot upload files through the page. To add a finished work, put its files in a folder such as `projects/my-project/`, then add a project card in `index.html` and link to the work from that card's detail section. Add new photos to `images/` and add their file name, description, and caption to the `photos` array in `js/script.js`.

## Run locally

Open the project folder in Visual Studio Code and use Live Server to open `index.html`. Confirm that the photos, video, and audio load. Try each interactive feature, including invalid form entries, a filter with no matches, and Previous/Next at both ends of the gallery.

## Deployment

This is a static website. For Render, connect the GitHub repository as a Static Site and use:

- Root Directory: leave blank
- Build Command: `echo "No build required"`
- Publish Directory: `.`
- Auto Deploy: enabled for the final branch

After deployment, test the public HTTPS URL at phone and desktop widths and verify that the media and interactive controls work.

## Sources

- [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development) — linked as a learning resource.
- Personal photos and recordings belong to the author.
