# Video Timestamp Recorder

Video Timestamp Recorder is a web-based tool designed for watching podcasts or videos and recording timestamps for important moments. The app allows you to select a video file, record timestamps while watching, generate thumbnails for each timestamp, and save those timestamps in a text file for later reference.

## Features

- **Video Playback:**
  - Upload a video file (MP4 format).
  - Option to play, pause, skip, or rewind the video by small intervals (10s or 30s).

- **Record Timestamps:**
  - Easily mark timestamps while watching the video.
  - Each timestamp gets stored in a text area and labeled with the timestamp in `hh:mm:ss` format.

- **Thumbnails & Clips:**
  - Generates video thumbnails at specific timestamps.
  - Select thumbnails to jump directly to that timestamp.
  - Visual previews of added timestamps, each with a delete button.

- **Save the Timestamps:**
  - Save all recorded timestamps to a `.txt` file.
  - Timestamps are saved in a plain text format for easy editing and sharing.

## Usage

- **Uploading a Video:**  
  Click the "Choose File" button to select an MP4 video. The video will load into the player and display its file name.

- **Playback Controls:**  
  Use the "Back 30s," "Back 10s," "Skip 10s," and "Skip 30s" buttons to navigate through the video.

- **Recording Timestamps:**  
  While watching the video, click the "Record Timestamp" button to capture the current playback time (formatted as `hh:mm:ss`). The timestamp is then appended to the text area and stored locally.

- **Thumbnail Generation & Clip Navigation:**  
  Each recorded timestamp generates a thumbnail clip preview in the "Clips" section. Click on a thumbnail to jump directly to that timestamp in the video. Each thumbnail also includes a delete option to remove it if needed.

- **Saving Timestamps:**  
  Click the "Save Timestamps" button to download a text file containing all the recorded timestamps.
