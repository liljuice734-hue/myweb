# William Kapinga | ICT251 Portfolio

A responsive personal portfolio built with HTML, CSS, and JavaScript for ICT251 Web Technologies. The website retains my personal introduction, hobbies, learning plan, photos, recordings, and contact form, and adds interactive features.

## JavaScript features

1. **Contact form validation and preview:** checks the name, email, and message; reports problems beside the relevant fields; then displays a local preview. It does not send or store messages.
2. **Theme switch:** switches between dark and light colour themes.
3. **Photo gallery:** Previous and Next buttons move through the three photos and wrap at the beginning and end.
4. **Project and skill filter:** filters three learning examples, has a reset button, and explains when there are no matches.

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
