const apiKey = 'f113e837c9822b788f565a1bd33e626d'; // Replace this with your Last.fm API key
const method = 'user.getRecentTracks'; // Method to fetch recent tracks
const username = 'ringingparanoia'; // Replace this with the Last.fm username you want to fetch recent tracks for
const limit = 10; // Number of results to fetch per page
const page = 1; // Page number to fetch (optional)
const from = ''; // Beginning timestamp of a range (optional)
const to = ''; // End timestamp of a range (optional)
const extended = 1; // Includes extended data in each track (optional)

const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${apiKey}&user=${username}&limit=${limit}&page=${page}&from=${from}&to=${to}&extended=${extended}&format=json`;

// Function to fetch recent tracks
function fetchData() {
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display recent tracks
function displayRecentTracks(data) {
  if (!data || !data.recenttracks || !data.recenttracks.track) {
    console.error('Data is not in expected format')
    return;
  }

  const renectTracks = data.recenttracks.track;
  const table = document.createElement('table');
  const container = document.getElementById('recentTracksContainer');

  renectTracks.forEach(track => {
    const row = document.createElement('tr');
    const imageCell = document.createElement('td');
    const infoCell = document.createElement('td');
    const imageElement = document.createElement('img');
    const artistElement = document.createElement('p');
    const trackElement = document.createElement('p');
    
    imageElement.classList.add('icon');
    const artist = track.artist.name || 'Unknow Artist';
    const trackName = track.name

    const imageUrl = track.image.length > 1 ? track.image[1]['#text'] : null;

    // Check if image is available, otherwise placeholder
    if (imageUrl) {
      imageElement.src = imageUrl;
    } else {
      imageElement.src = 'placeholder.webp';
    }

    imageElement.style.width = '50px';
    artistElement.textContent = `${artist}`;
    trackElement.textContent = `${track.name}`;
    // Image center
    imageCell.style.verticalAlign = 'middle';
    imageCell.style.textAlign = 'center';
    imageCell.appendChild(imageElement);

    // Add click event listener to an image
    imageElement.addEventListener('click', () => {
      searchOnYouTube(artist, trackName);
    });

    // Add artist and track info
    infoCell.appendChild(artistElement);
    infoCell.appendChild(trackElement);

    row.appendChild(imageCell);
    row.appendChild(infoCell);

    table.appendChild(row);
  });

  
  container.appendChild(table);
}

// Call fetchData to fetch recent tracks and display them
fetchData()
    .then(data => {
        displayRecentTracks(data);
    });

// Function to generate request to YouTube
async function searchOnYouTube(artist, trackName) {
  try {
    const query = `${artist} - ${trackName}`;
    const apiKey = 'AIzaSyDCu-hwM4iaSvnIcTgoGzVxWb3JevcArRo';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const  videoId = data.items[0].id.videoId;
      embedYouTubeVideo(videoId);
    } else {
      console.error("No video found");
    }
  } catch (error) {
  console.error('Error searching on YT: ', error);
  }
}


// Function to embed a YT video on wwebpage
function embedYouTubeVideo (videoId) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.width = '560';
  iframe.height = '315';
  iframe.allowFullscreen = true;
  
  // Append the iframe to a container element
  const videoContainer  = document.getElementById('videoContainer');
  videoContainer.innerHTML = '';
  videoContainer.appendChild(iframe);
}
