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
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    $('.duration').html(`${minutes}:${seconds}`);
    $('.banner').text(`${e.target.files[0].name}`);
});


//get remaining time
audio.addEventListener('timeupdate', function() {
    let currentTime = audio.currentTime;
    let duration = audio.duration;
    let remainingTime = duration - currentTime;
    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);
    $('.duration').html(`${minutes}:${seconds}`);
    $('.progress-bar-fill').css('width', `${(currentTime / duration) * 100}%`);
});
    console.log('File: ', e.target.files[0]);
});

function play() {
    if (audio) {
        audio.play();
        $('.play').hide();
        $('.pause').show();
        $('.stop').show();
    }
}

function pause() {
    if (audio) {
        audio.pause();
        $('.pause').hide();
        $('.play').show();
        $('.stop').show();
    }
}

function stop() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        $('.progress-bar').width();
        $('.pause').hide();
        $('.play').show();
        $('.stop').hide();
    }
}

$('.controls').on('click', function(evt) {
    console.log(evt.target);
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