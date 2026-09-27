const video = document.getElementById('video');
const rangeTime = document.getElementById('range-time');
const currentTimeLabel = document.getElementById('current-time');
const playBtn = document.getElementById('play');
const volume = document.getElementById('volume');
const volumeBtn = document.getElementById('volume_stop');
const speedSelect = document.getElementById('speed');

let lastVolume = 0.1;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '00:00';

    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}

function updateTimeUI() {
    rangeTime.value = video.currentTime || 0;
    currentTimeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;

    if (video.ended) {
        playBtn.src = 'img/repeat.svg';
    } else if (video.paused) {
        playBtn.src = 'img/play.svg';
    } else {
        playBtn.src = 'img/pause.svg';
    }
}

function togglePlay() {
    if (video.ended) {
        video.currentTime = 0;
    }

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateVolumeIcon() {
    if (video.muted || Number(volume.value) === 0) {
        volumeBtn.src = 'img/volume-off.svg';
    } else {
        volumeBtn.src = 'img/volume-up.svg';
    }
}

video.volume = 0.1;
volume.value = 0.1;

rangeTime.addEventListener('input', () => {
    video.currentTime = Number(rangeTime.value);
    updateTimeUI();
});

video.addEventListener('loadedmetadata', () => {
    rangeTime.min = 0;
    rangeTime.max = video.duration;
    updateTimeUI();
});

video.addEventListener('timeupdate', updateTimeUI);
video.addEventListener('play', updateTimeUI);
video.addEventListener('pause', updateTimeUI);
video.addEventListener('ended', updateTimeUI);

playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

document.getElementById('rewind-back').addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
    updateTimeUI();
});

document.getElementById('rewind-forward').addEventListener('click', () => {
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    updateTimeUI();
});

volume.addEventListener('input', () => {
    const value = Number(volume.value);
    video.muted = value === 0;
    video.volume = value;

    if (value > 0) {
        lastVolume = value;
    }

    updateVolumeIcon();
});

volumeBtn.addEventListener('click', () => {
    if (video.muted || Number(volume.value) === 0) {
        const restoredVolume = lastVolume > 0 ? lastVolume : 0.1;
        video.muted = false;
        video.volume = restoredVolume;
        volume.value = restoredVolume;
    } else {
        lastVolume = Number(volume.value);
        video.muted = true;
        video.volume = 0;
        volume.value = 0;
    }

    updateVolumeIcon();
});

speedSelect.addEventListener('change', () => {
    video.playbackRate = Number(speedSelect.value);
});

updateTimeUI();
updateVolumeIcon();