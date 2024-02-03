const apiKey = "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";

document.addEventListener("DOMContentLoaded", () => {
    let but = document.getElementById("but");
    let video = document.getElementById("vid");
    let canvas = document.querySelector('canvas');
    let takePicture = document.querySelector(".takePicture");
    let mediaDevices = navigator.mediaDevices;

    vid.muted = true;

    // Accessing the user camera and video.
    mediaDevices
        .getUserMedia({
            video: true,
        })
        .then((stream) => {
            // Changing the source of video to the current stream.
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
        })
        .catch(alert);

    let context = canvas.getContext('2d');
    takePicture.addEventListener('click', async () => {
        console.log("Taking picture...");

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, 640, 480);

        // Call detectObjects function with the video element
        const result = await detectObjects(video);
        console.log(result);
    });
});

async function detectObjects(videoElement) {
    // Create a canvas element to draw the video frame
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = videoElement.videoWidth;
    tempCanvas.height = videoElement.videoHeight;
    tempContext.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);

    // Convert the canvas content to base64
    const base64Image = tempCanvas.toDataURL('image/jpeg').split(',')[1];

    askGpt(base64Image)

}




function askGpt(base64Image){
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      "model": "gpt-4-vision-preview",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "What's in this image?"
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      "max_tokens": 300
    })
  };

  fetch('https://api.openai.com/v1/chat/completions', requestOptions)
  .then(response => response.json())
  .then(data => console.log(data.choices[0].message.content))
  .catch(error => console.error('Error:', error));
}

