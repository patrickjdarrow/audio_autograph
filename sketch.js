// p5 Params
// https://p5js.org/reference/
let x = 1200
let y = 600
let fr = 60
let yPad = 100

// Frequency bins
let binSize = 36
y = y - y % binSize // adjust for frequency bins
x = x - x % binSize // adjust for frequency bins

// Grid dimensions
let nx = x / binSize
let ny = y / binSize

// State machine
let held = false
let mx = 0
let my = 0
let playing = false
let button
let xpos = 0

// Sound
// https://github.com/keithwhor/audiosynth
let piano = Synth.createInstrument('piano');
// C2 - C6
let naturals = {35: ['C', 2], 34: ['D', 2], 33: ['E', 2], 32: ['F', 2], 31: ['G', 2], 30: ['A', 2], 29: ['B', 2], 28: ['C', 3], 27: ['D', 3], 26: ['E', 3], 25: ['F', 3], 24: ['G', 3], 23: ['A', 3], 22: ['B', 3], 21: ['C', 4], 20: ['D', 4], 19: ['E', 4], 18: ['F', 4], 17: ['G', 4], 16: ['A', 4], 15: ['B', 4], 14: ['C', 5], 13: ['D', 5], 12: ['E', 5], 11: ['F', 5], 10: ['G', 5], 9: ['A', 5], 8: ['B', 5], 7: ['C', 6], 6: ['D', 6], 5: ['E', 6], 4: ['F', 6], 3: ['G', 6], 2: ['A', 6], 1: ['B', 6], 0: ['C', 7]}
let spectrogram = math.zeros(nx,ny)

function setup() {

    cnv = createCanvas(x, y)
    cnv.position((windowWidth - x)/2, yPad)

    frameRate(fr)
    background(0)
    fill(255,255,255)
    strokeWeight(15)

    playButton = createButton('Listen / STOP');
    playButton.position(windowWidth/2 - 50, y + yPad + 5);
    playButton.mousePressed(play);

    resetButton = createButton('Reset');
    resetButton.position((windowWidth - x)/2, y + yPad + 5);
    resetButton.mousePressed(reset);

    volume = createSlider(0, 100, 50, 5);
    volume.position(x + (windowWidth - x)/2 - 150, y + yPad + 5)
}


function draw() {

    // Playing
    if (playing) {

        if (xpos < nx) {
            for (var ypos = 0; ypos < ny; ypos++) {
                Synth.setVolume(spectrogram.subset(math.index(xpos,ypos)) / 1000.0 * (volume.value() / 100.0))
                piano.play(naturals[ypos][0], naturals[ypos][1], 0.5)
            }

            xpos += 1
        }

        else {
            play()
        }
    }

    // Drawing
    else {

        if (mouseIsPressed) {

            if (held) {

                if (mouseButton == LEFT) {
                    strokeWeight(15)
                    stroke(255)
                }

                if (mouseButton == CENTER) {
                    strokeWeight(35)
                    stroke(0)
                }

                line(mx, my, mouseX, mouseY)
            }

            else {
                held = true
            }

            mx = mouseX
            my = mouseY
        }

        else {
            held = false
        }
    }

}

// Play button
function play() {

    if (playing) {
        playing = false
        xpos = 0

        set(0,0, pixels)
        updatePixels()
        
        stroke(255)
        strokeWeight(15)

    }
    else {
        playing = true
        loadPixels()
        savedState = pixels

        noStroke()
        averageFilter()
    }

}

// Reset button
function reset() {

    playing = false
    xpos = 0

    clear()
    background(0)
        
    stroke(255)
    strokeWeight(15)

}

// ms delay
function delay(t) {

    var start = millis()
    var target = start + t

    while(millis() <= target) {}
}

// Average filter with binSize x binSize kernel
function averageFilter() {

    for (var i = 0; i < nx; i++) {
        for (var j = 0; j < ny; j++) {

            var sum = 0

            for (var k = 0; k < binSize; k++) {
                for (var l = 0; l < binSize; l++) {

                    sum += pixels[4 * pixelDensity() * ( (j * x + i) * binSize + k * x + l)]
                }
            }

            magnitude = sum/binSize/binSize

            spectrogram.subset(math.index(i, j), magnitude)   

            fill(magnitude)
            rect(i * binSize,
                j * binSize,
                binSize,
                binSize)
        }
    }
}

// Chrome compatibility
function touchStarted() {
  getAudioContext().resume()
}