const form = document.getElementById("podcastform");
const podcastlist = document.getElementById("podcastlist");

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    addPodcast(
        form.elements.podcastName.value,
        form.elements.podcastHost.value,
        form.elements.podcastGenre.value,
        form.elements.podcastDuration.value,
        form.elements.podcastLink.value
    );

    // Clear the form values
    form.reset();
});

// Display a podcast in the list
function displayPodcast(podcast) {
    let item = document.createElement("li");
    item.setAttribute("data-id", podcast.id);
    item.innerHTML = `
        <p><strong>${podcast.name}</strong><br>
        Host: ${podcast.host}<br>
        Genre: ${podcast.genre}<br>
        Duration: ${podcast.duration} minutes<br>
        <a href="${podcast.link}" target="_blank">Listen</a></p>
    `;

    podcastlist.appendChild(item);

    // Setup delete button
    let delButton = document.createElement("button");
    delButton.textContent = "Delete";
    item.appendChild(delButton);

    // Delete button click handler
    delButton.addEventListener("click", function () {
        podcastList = podcastList.filter(p => p.id !== podcast.id);
        item.remove();
    });
}

// Create an array to store podcasts
let podcastList = [];

// Add a podcast to the list
function addPodcast(name, host, genre, duration, link) {
    let podcast = {
        name,
        host,
        genre,
        duration: parseInt(duration, 10),
        link,
        id: Date.now()
    };

    podcastList.push(podcast);
    displayPodcast(podcast);
}

async function fetchPodcasts() {
    try {
        // Fetch the access token from the backend server
        const tokenResponse = await fetch('http://127.0.0.1:8888/api/token');
        if (!tokenResponse.ok) {
            throw new Error(`Token fetch failed: ${tokenResponse.statusText}`);
        }
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch podcasts using the access token
        const response = await fetch('https://api.spotify.com/v1/search?q=technology&type=show&limit=10', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Podcast fetch failed: ${response.statusText}`);
        }
        const data = await response.json();

        // Process and display podcasts
        const podcasts = data.shows.items;
        podcasts.forEach(item => {
            addPodcast(
                item.name,
                item.publisher,
                item.genres.join(', '),
                item.total_episodes || 'Unknown',
                item.external_urls.spotify
            );
        });
    } catch (error) {
        console.error('Error fetching podcasts:', error);
    }
}



// Initial fetch of podcasts
fetchPodcasts();
