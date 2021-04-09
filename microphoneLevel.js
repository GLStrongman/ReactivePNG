window.onload=function (){
    (async () => {
        let volumeCallback = null;
        let volumeInterval = null;
        let volumeThreshold = 45;
        let spriteCounter = 0;
        const volumeVisualizer = document.getElementById('volume-visualizer');
        // Initialize
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true
                }
            });
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(audioStream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.minDecibels = -127;
            analyser.maxDecibels = 0;
            analyser.smoothingTimeConstant = 0.4;
            audioSource.connect(analyser);
            const volumes = new Uint8Array(analyser.frequencyBinCount);
            volumeCallback = () => {
                analyser.getByteFrequencyData(volumes);
                let volumeSum = 0;
                for(const volume of volumes)
                    volumeSum += volume;
                const averageVolume = volumeSum / volumes.length;
                // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
                volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
                let currentVolume = averageVolume * (100 / 127);
                volumeThreshold = document.getElementById("myRange").value;
                document.getElementById("sliderValue").innerText = volumeThreshold;
                let spriteType = document.getElementById("coffee").checked;
                if (spriteType == false) {
                    if (currentVolume <= volumeThreshold){
                        document.getElementById("sprite").src = "spriteClosed.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(95%)');
                    }
                    else {

                        document.getElementById("sprite").style.setProperty('filter', 'brightness(100%)');
                        switch(spriteCounter) {
                            case 0:
                                document.getElementById("sprite").src = "spriteOpenSmall.png";
                                break;
                            case 1:
                                document.getElementById("sprite").src = "spriteOpen.png";
                                break;
                            case 2:
                                document.getElementById("sprite").src = "spriteOpenBig.png";
                                break;
                            default:
                                document.getElementById("sprite").src = "spriteOpen.png";
                                break;
                        }
                    }
                }
                else {
                    if (currentVolume <= volumeThreshold){
                        document.getElementById("sprite").src = "spriteCoffee.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(95%)');
                    }
                    else {
                        document.getElementById("sprite").src = "spriteCoffeeOpen.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(100%)');
                    }
                }

                spriteCounter = spriteCounter + 1;
                if (spriteCounter > 3){
                    spriteCounter = 0;
                }

            };
        } catch(e) {
            console.error('Failed to initialize volume visualizer, simulating instead...', e);
            // Simulate mic
            let lastVolume = 50;
            volumeCallback = () => {
                const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
                lastVolume = volume;
                volumeVisualizer.style.setProperty('--volume', volume + '%');
            };
        }
        if(volumeCallback !== null && volumeInterval === null)
            volumeInterval = setInterval(volumeCallback, 100);
    })();
};
