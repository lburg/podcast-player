document.addEventListener("DOMContentLoaded", function (event) {
    var audio = document.querySelector('#player');
    var url = audio.getAttribute('src');
    var filename = url.replace(/^.*[\\\/]/, '');
    var currentTime = document.querySelector('#currentTime');
    var totalTime = document.querySelector('#totalTime');
    var changeSpeed = document.querySelector('#changeSpeed');
    var showSpeed = document.querySelector("#showSpeed");
    var changeVolume = document.querySelectorAll('input.accessi');
    var playbutton = document.querySelector("#playbutton");
    var playtext = document.querySelector("#playtext");
    var progressbar = document.querySelector('#seekbar');
    var localProgress = localStorage.getItem(filename);
    if (!localProgress) {
        localStorage.setItem(filename, audio.currentTime);
    }


    //Maximum and minimum play speed
    var playbackRateMax = 2;
    var playbackRateMin = 0.75;
    //A function to change play speed
    function setPlaySpeed() {
        var currentSpeed = audio.playbackRate;
        if (currentSpeed < playbackRateMax) {
            audio.playbackRate = currentSpeed + 0.25;
        } else {
            audio.playbackRate = playbackRateMin;
        }
        showSpeed.innerHTML = audio.playbackRate;
    }

    //A function to set audio volume
    function setVolume(val) {
        audio.volume = val;
    }

    //A function to play and pause audio
    function playAudio() {
        //Check if audio has been started before and is not playing
        if (audio.currentTime >= 0 && audio.paused) {

            //Checking if there's any progress inside localstorage
            if (localStorage.getItem(filename)) {
                //Set the audio current time to the time stored in local storage
                audio.currentTime = localStorage.getItem(filename);
                audio.play();
            }

            //If no progress, just play from the beginnning and add pause icon
            else {
                audio.play();
            }
            playtext.setAttribute('class', 'pause-icon');
        }

        //Else audio is playing, pause it and remove pause icon
        else {
            audio.pause();
            playtext.setAttribute('class', 'play-icon');
        }
    }


    //A function to change the progress bar value on click
    function seekProgressBar(progress) {
        //Get the progress bar % location and add it to the audio current time
        var percent = progress.offsetX / this.offsetWidth;
        audio.currentTime = percent * audio.duration;
        progressbar.value = percent / 100;

        //If audio is paused but already started, update the progress to localstorage
        if (audio.duration > 0 && audio.paused) {
            localStorage.setItem(filename, audio.currentTime);
        }
        udpateProgress();
    }

    //A Function to get the audio duration, format it and show it
    function getTotalTime(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time - hours * 3600) / 60);
        var seconds = time - hours * 3600 - minutes * 60;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        seconds = parseInt(seconds, 10);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        totalTime.innerHTML = " / " + hours + ':' + minutes + ':' + seconds;
    }

    //Function to get the audio current progress, format it and show it
    function formatTime(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time - hours * 3600) / 60);
        var seconds = time - hours * 3600 - minutes * 60;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        seconds = parseInt(seconds, 10);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        currentTime.innerHTML = hours + ':' + minutes + ':' + seconds;
    }

    //Function to get the audio current progress and show it inside the progress bar
    function udpateProgress() {
        progressbar.value = audio.currentTime / audio.duration;
    }

    //A function to update the audio progress in real time in the player and local storage
    var update = setInterval(function () {
        getTotalTime(audio.duration);

        //Updating progress bar in real time
        if (localProgress) {
            formatTime(localStorage.getItem(filename));
        } else {
            formatTime(audio.currentTime);
        }
        if (audio.duration && localProgress) {
            progressbar.value = localStorage.getItem(filename) / audio.duration;
        }
        //Updating localstorage in real time
        if (audio.duration > 0 && !audio.paused) {
            localStorage.setItem(filename, audio.currentTime);
        }
    }, 10);

    //Event Listener checking for the audio progression
    audio.addEventListener('progress', udpateProgress, false);

    //Event listeners checking for any change by the user
    changeSpeed.addEventListener('click', setPlaySpeed, false);
    playbutton.addEventListener('click', playAudio, false);
    progressbar.addEventListener('click', seekProgressBar, false);
    for (var i = 0; i < changeVolume.length; i++) {
        changeVolume[i].addEventListener("click", function () {
            setVolume(this.value);
        });
    }
});