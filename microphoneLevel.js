window.onload=function (){
    (async () => {
        let volumeCallback = null;
        let volumeInterval = null;
        let volumeThreshold = 45;
        const volumeVisualizer = document.getElementById('volume-visualizer');
        //const startButton = document.getElementById('start');
        //const stopButton = document.getElementById('stop');
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
                        document.getElementById("sprite").src = "spriteOpen.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(100%)');
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

            };
        } catch(e) {
            console.error('Failed to initialize volume visualizer, simulating instead...', e);
            // Simulation
            //TODO remove in production!
            let lastVolume = 50;
            volumeCallback = () => {
                const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
                lastVolume = volume;
                volumeVisualizer.style.setProperty('--volume', volume + '%');
            };
        }
        // Use
        if(volumeCallback !== null && volumeInterval === null)
            volumeInterval = setInterval(volumeCallback, 100);
    })();
}
