# Required Postman demonstration video

This guide and collection are prepared; a Postman screen recording is still required.

1. Start the app. Open Postman and import `ICT251-Portfolio.postman_collection.json`.
2. Set collection variable `baseUrl` to `http://localhost:3000`, or your actual deployed HTTPS origin (no trailing slash).
3. Start a screen recording (for example, Windows Snipping Tool video capture). Keep the Postman method, URL, Body tab and JSON response visible.
4. Send request 1 (GET all). Show the records and HTTP 200. GET has Body -> none.
5. Send request 2 (POST). Show raw JSON body, HTTP 201, and the generated id. Its test script automatically saves recordId.
6. Send request 3 (GET one). Show its resolved id, Body -> none, HTTP 200 and JSON record.
7. Send request 4 (PUT). Show the JSON body changing status to Completed and HTTP 200 response.
8. Send request 5 (DELETE). Show URL with the same id, Body -> none, HTTP 200 and JSON deletion confirmation.
9. Send request 6 to show the deleted record returns 404. Show the Tests results for each request.
10. Demonstrate the frontend: create a temporary record, edit it, delete it, and show that the table refreshes after each operation.
11. Stop and save the video. Upload it to the destination your lecturer requires and ensure the lecturer can view it.

GET and DELETE do not need JSON bodies. The handout asks for bodies to be visible: show Body -> none for those methods. DELETE deliberately returns HTTP 200 with JSON because the activity requires JSON for every response.
