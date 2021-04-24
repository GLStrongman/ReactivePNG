// Original microphone control code taken from StackOverflow, written by user 'Minding' and modified by me

window.onload=function (){
    (async () => {
        let volumeCallback = null;
        let volumeInterval = null;
        let volumeThreshold = 45;
        let brightnessValue = 95;
        //let frameCount = 3;
        let spriteCounter = 0;
        const volumeVisualizer = document.getElementById('volume-visualizer');
        
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

            // Main loop
            volumeCallback = () => {
                analyser.getByteFrequencyData(volumes);
                let volumeSum = 0;
                for(const volume of volumes)
                    volumeSum += volume;
                const averageVolume = volumeSum / volumes.length;
                volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
                let currentVolume = averageVolume * (100 / 127);
                volumeThreshold = document.getElementById("myRange").value;
                brightnessValue = document.getElementById("pngBrightness").value;
                // frameCount = document.getElementById("framesRange").value;
                document.getElementById("sliderValue").innerText = volumeThreshold;
                document.getElementById("brightnessDisplay").innerText = brightnessValue;
                // document.getElementById("sliderValueFrames").innerText = frameCount;
                // let coffeeActive = document.getElementById("coffee").checked;

                // Image display handling
                let animatedActive = document.getElementById("animated").checked;
                if (animatedActive === true) {
                    if (currentVolume <= volumeThreshold){
                        document.getElementById("sprite").src = "spriteClosed.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(' + brightnessValue + '%)');
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
                // else if (coffeeActive === true) {
                //     if (currentVolume <= volumeThreshold){
                //         document.getElementById("sprite").src = "spriteCoffee.png";
                //         document.getElementById("sprite").style.setProperty('filter', 'brightness(95%)');
                //     }
                //     else {
                //         document.getElementById("sprite").src = "spriteCoffeeOpen.png";
                //         document.getElementById("sprite").style.setProperty('filter', 'brightness(100%)');
                //     }
                // }
                else {
                    if (currentVolume <= volumeThreshold){
                        document.getElementById("sprite").src = "spriteClosed.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(' + brightnessValue + '%)');
                    }
                    else {
                        document.getElementById("sprite").src = "spriteOpen.png";
                        document.getElementById("sprite").style.setProperty('filter', 'brightness(100%)');
                    }
                }

                spriteCounter = spriteCounter + 1;
                if (spriteCounter > 3){
                    spriteCounter = 0;
                }

                // Background handling
                let blueBack = document.getElementById("blue").checked;
                let magBack = document.getElementById("magenta").checked;
                if (blueBack === true) { document.getElementById("avatarBox").style.setProperty('background-color', '#0033cc'); }
                else if (magBack === true) { document.getElementById("avatarBox").style.setProperty('background-color', '#FF00FF'); }
                else { document.getElementById("avatarBox").style.setProperty('background-color', '#00b140'); }

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
