// Function to clear timestamps, thumbnails, and clipboard
function clearData() {
    localStorage.removeItem('videoTimestamps');
    displayTimestamps('');
    clearThumbnails();
    // Hide Back and Skip buttons initially
    document.getElementById('back30Button').style.display = 'none';
    document.getElementById('back10Button').style.display = 'none';
    document.getElementById('skip10Button').style.display = 'none';
    document.getElementById('skip30Button').style.display = 'none';
}

// Clear timestamps, thumbnails, and clipboard when the page loads
window.addEventListener('load', clearData);

// Disable timestamp buttons initially
document.getElementById('recordTimestampButton').disabled = true;
document.getElementById('saveTimestampsButton').disabled = true;

document.getElementById('videoInput').addEventListener('change', function() {
    var videoInput = document.getElementById('videoInput');
    if (videoInput.files.length > 0) {
        clearData();

        var videoPlayer = document.getElementById('videoPlayer');
        var videoURL = URL.createObjectURL(videoInput.files[0]);
        videoPlayer.src = videoURL;
        videoPlayer.play();

        // Set the height of the timestamps textarea to match the height of the video player
        var videoHeight = videoPlayer.offsetHeight;
        document.getElementById('timestampsTextarea').style.height = (videoHeight - 50) + 'px';

        // Enable timestamp buttons
        document.getElementById('recordTimestampButton').disabled = false;
        document.getElementById('saveTimestampsButton').disabled = false;
        // Show Back and Skip buttons
        document.getElementById('back30Button').style.display = 'inline-block';
        document.getElementById('back10Button').style.display = 'inline-block';
        document.getElementById('skip10Button').style.display = 'inline-block';
        document.getElementById('skip30Button').style.display = 'inline-block';

        // Update the label with the name of the selected file
        var videoFileNameLabel = document.getElementById('videoLabel');
        var fileName = videoInput.files[0].name;
        if (fileName.length > 55) {
            fileName = fileName.substring(0, 52) + '...';
        }
        videoFileNameLabel.textContent = fileName;

        // Clear the placeholder
        document.getElementById('timestampsTextarea').placeholder = '';
    }
});

document.getElementById('recordTimestampButton').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    var currentTime = Math.floor(videoPlayer.currentTime);

    var timestampsTextarea = document.getElementById('timestampsTextarea');
    if (timestampsTextarea.value.trim() === "Choose a video file to get started") {
        timestampsTextarea.value = formatTimestamp(currentTime) + ' - ';
    } else if (timestampsTextarea.value.trim() === "") {
        timestampsTextarea.value = formatTimestamp(currentTime) + ' - ';
    } else {
        timestampsTextarea.value += '\n' + formatTimestamp(currentTime) + ' - ';
    }

    updateLocalStorage(timestampsTextarea.value);

    // Add thumbnail
    addThumbnail(currentTime);
});

// Function to add thumbnail to the clips section
function addThumbnail(currentTime) {
    var thumbnailContainer = document.createElement('div');
    thumbnailContainer.classList.add('thumbnail');

    var videoPlayer = document.getElementById('videoPlayer');
    var thumbnailImage = document.createElement('img');
    thumbnailImage.src = generateThumbnail(videoPlayer, 120, 80);
    thumbnailContainer.appendChild(thumbnailImage);

    var timestampLabel = document.createElement('p');
    timestampLabel.textContent = formatTimestamp(currentTime);
    timestampLabel.classList.add('timestamp');
    thumbnailContainer.appendChild(timestampLabel);

    // Add click event to the thumbnail to seek to the corresponding timestamp
    thumbnailContainer.addEventListener('click', function() {
        var selectedThumbnail = document.querySelector('.thumbnail.selected');
        if (selectedThumbnail) {
            selectedThumbnail.classList.remove('selected');
            selectedThumbnail.querySelector('.delete-button').remove(); // Remove delete button if present
        }
        thumbnailContainer.classList.add('selected');
        addDeleteButton(thumbnailContainer, currentTime); // Add delete button to selected thumbnail
        videoPlayer.currentTime = currentTime;
    });

    document.getElementById('thumbnails').appendChild(thumbnailContainer);

    // Update thumbnail counter and label
    thumbnailCounter++;
    updateClipsLabel(thumbnailCounter);
}

// Function to add delete button to selected thumbnail
function addDeleteButton(thumbnailContainer, currentTime) {
    var deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click event propagation to thumbnail
        thumbnailContainer.remove(); // Remove selected thumbnail
        thumbnailCounter--;
        updateClipsLabel(thumbnailCounter);
        removeTimestamp(currentTime);
    });
    thumbnailContainer.appendChild(deleteButton);
}

// Function to remove timestamp from timestamps view
function removeTimestamp(currentTime) {
    var timestampsTextarea = document.getElementById('timestampsTextarea');
    var currentText = timestampsTextarea.value;
    var lines = currentText.split('\n');
    var newTextLines = lines.filter(function(line) {
        return !line.includes(formatTimestamp(currentTime));
    });
    var newText = newTextLines.join('\n');
    timestampsTextarea.value = newText;
    updateLocalStorage(newText);
}

// Function to rewind the video by 30 seconds
document.getElementById('back30Button').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.currentTime -= 30;
});

// Function to rewind the video by 10 seconds
document.getElementById('back10Button').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.currentTime -= 10;
});

// Function to skip the video by 10 seconds
document.getElementById('skip10Button').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.currentTime += 10;
});

// Function to skip the video by 30 seconds
document.getElementById('skip30Button').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.currentTime += 30;
});

document.getElementById('saveTimestampsButton').addEventListener('click', function() {
    var timestampsTextarea = document.getElementById('timestampsTextarea');
    saveTimestampsToFile(timestampsTextarea.value);
});

function displayTimestamps(text) {
    var timestampsTextarea = document.getElementById('timestampsTextarea');
    timestampsTextarea.value = text;
}

function formatTimestamp(timestamp) {
    var hours = Math.floor(timestamp / 3600);
    var minutes = Math.floor((timestamp % 3600) / 60);
    var seconds = Math.floor(timestamp % 60);
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function clearThumbnails() {
    var thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
}

function saveTimestampsToFile(text) {
    var videoInput = document.getElementById('videoInput');
    var fileName = videoInput.files[0].name;
    if (fileName.length > 55) {
        fileName = fileName.substring(0, 52) + '...';
    }
    var truncatedLabel = fileName.replace(/\.[^/.]+$/, "").substring(0, 52); // Remove extension and truncate label
    var blob = new Blob([text], { type: 'text/plain' });
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.download = 'timestamps-' + truncatedLabel + '.txt';
    a.click();
}

// Function to update Clips label
function updateClipsLabel(count) {
    document.getElementById('clipsLabel').textContent = 'Clips (' + count + ')';
}

// Function to generate thumbnail from video
function generateThumbnail(video, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

// Event listener to remove selected state and delete button when clicking away from thumbnail
document.body.addEventListener('click', function(event) {
    var thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(function(thumbnail) {
        if (!thumbnail.contains(event.target)) {
            thumbnail.classList.remove('selected');
            if (thumbnail.querySelector('.delete-button')) {
                thumbnail.querySelector('.delete-button').remove(); // Remove delete button if present
            }
        }
    });
});

// Function to update local storage with timestamps text
function updateLocalStorage(text) {
    localStorage.setItem('videoTimestamps', text);
}
