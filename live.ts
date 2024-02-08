import WebSocket from 'ws';
// UV4L WebSocket URL for video with embedded audio
const videoWithAudioWebSocketUrl = 'http://192.168.1.10:8080/stream/webrtc'; // Replace with actual UV4L WebSocket URL

// Create WebSocket client for video with audio stream
const ws = new WebSocket(videoWithAudioWebSocketUrl);

// Handle WebSocket connection opened
ws.on('open', () => {
    console.log('Connected to UV4L video with audio stream');
});

// Handle WebSocket messages (video with embedded audio data)
ws.on('message', (videoWithAudioData) => {
    // Process video with embedded audio data
    console.log('Received video with audio data:', videoWithAudioData.length);
});

// Handle WebSocket connection closed
ws.on('close', () => {
    console.log('Disconnected from UV4L video with audio stream');
});

// Handle WebSocket errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
