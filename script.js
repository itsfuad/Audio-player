//load audio
let audio;

$('.file-picker').on('change', function(e) {

    if (audio){
        audio.removeEventListener('timeupdate', function(){});
        audio.removeEventListener('progress',  function(){});   
        audio.removeEventListener('loadeddata',  function(){});
        stop();
    }
    delete audio;
    audio = new Audio(URL.createObjectURL(e.target.files[0]));
    //get audio duration
    //get audio duration
audio.addEventListener('loadedmetadata', function() {
    let duration = audio.duration;
    let minutes = Math.floor(duration / 60).toString();
    let seconds = Math.floor(duration % 60).toString();
    //make 00:00 format, use padStart to add 0 if seconds is less than 10
    $('.duration').html(`${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`);
    $('.banner').text(`${e.target.files[0].name}`);

    //init audio context
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
});


//get remaining time
audio.addEventListener('timeupdate', function() {
    let currentTime = audio.currentTime;
    let duration = audio.duration;
    let remainingTime = duration - currentTime;
    let minutes = Math.floor(remainingTime / 60).toString();
    let seconds = Math.floor(remainingTime % 60).toString();
    $('.duration').html(`${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`);
    $('.progress-bar-fill').css('width', `${(currentTime / duration) * 100}%`);
});
   // console.log('File: ', e.target.files[0]);
});

$('.controls').on('click', function(evt) {
    //console.log(evt.target);
    let target = evt.target;
    if (target.classList.contains('fa-play')) {
        play();
    }
    else if (target.classList.contains('fa-pause')) {
        pause();
    }
    else if (target.classList.contains('fa-stop')) {
        stop();
    }
});

//update audio offset when dragging
$('.progress-bar').on('click', function(evt) {
    let offset = evt.offsetX;
    let width = $('.progress-bar').width();
    let duration = audio.duration;
    audio.currentTime = (offset / width) * duration;
});

const canvas = $('#canvas')[0];
canvas.height = 300;
const ctx = canvas.getContext('2d');

//draw the audio bars. make sure to handle play/pause/stop and replay
let audioCtx;
let source;
let analyser;
let bufferLength;
let dataArray;

function play(){
    //play the audio and canvas
    audio.play();
    $('.play').hide();
    $('.pause').show();
    $('.stop').show();
    draw();
}

function draw() {
    //draw the audio bars
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let barWidth = (canvas.width / bufferLength);
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = '#6aa4db7a';
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        ctx.fillStyle = '#6aa4db';
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, 2);
        x += barWidth + 1;
    }
}

function pause() {
    //stop the audio and canvas
    audio.pause();
    $('.play').show();
    $('.pause').hide();
}

function stop() {
    //stop the audio and canvas
    audio.pause();
    audio.currentTime = 0;
    $('.play').show();
    $('.pause').hide();
    $('.stop').hide();
    $('.duration').html('0:00');
    $('.progress-bar-fill').css('width', '0%');
}
