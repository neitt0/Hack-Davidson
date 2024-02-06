const apiKey = // "YOUR OPENAI API KEY GOES HERE";

document.addEventListener("DOMContentLoaded", () => {
    let video = document.getElementById("vid");
    let canvas = document.querySelector('canvas');
    let takePicture = document.querySelector(".takePicture");
    let mediaDevices = navigator.mediaDevices;

    let outputType = document.getElementById('outputType').value
    console.log(typeof outputType)

    
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

    async function getCanvasPicture() {
      console.log("Taking picture...");
      canvas.style.display = 'block'
      
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, 640, 480);
        
      // Call detectObjects function with the video element
      const result = await detectObjects(video);
      console.log(result);

    }

    takePicture.addEventListener('click', async () => {
      // get dropdown options
      outputType = document.getElementById('outputType').value
      console.log(outputType)
      
      return getCanvasPicture()
    });

    window.addEventListener('keydown', async (event) => {
      // get dropdown options
      outputType = document.getElementById('outputType').value
      console.log(outputType)

      if (event.code === 'Space') {
        return getCanvasPicture()
      }
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
    /////// Help from mentor
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
                "text": `What is this image?`
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:image/jpeg;base64,${base64Image}`
                } /////// Help from mentor
              }
            ]
          }
        ],
        "max_tokens": 300
      })
    };

    let outputArea = document.querySelector('#chatGPTOutput')
    
    fetch('https://api.openai.com/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .then(data => {
      /////// Help from mentor
      gptOutput = data.choices[0].message.content;
      console.log(gptOutput)
      outputArea.value = gptOutput;

      let msg = new SpeechSynthesisUtterance();
      msg.text = gptOutput;
      window.speechSynthesis.speak(msg)
    })
    .catch(error => console.error('Error:', error));
  }
  
