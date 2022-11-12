export class Player {
  constructor(url, nodeElement) {
    this.nodeElement = nodeElement;
    this.url = url;
    this.playBtn = nodeElement.querySelector('.play-container');
    this.volumeBtn = nodeElement.querySelector('.volume-button');
    this.volumeRange = nodeElement.querySelector('.volume-slider');
    this.playRange = nodeElement.querySelector('.timeline');
    this.playerName = this.nodeElement.className;
    this.audio = new Audio(url);
    this.updateTimer = null;
    this.lastVolumeLevel;
    this.bundle();
  }

  bundle() {
    this.playBtn.onclick = this.togglePlay.bind(this);
    this.volumeBtn.onclick = this.toggleSound.bind(this);
    this.volumeRange.onclick = this.setVolume.bind(this);
    this.playRange.onclick = this.setPlay.bind(this);

    // audio file
    this.audio.addEventListener('loadeddata', () => {
      // pre settings(volume 30%)
      this.updateData();
      this.nodeElement.querySelector('.total').textContent =
        this.getTimeCodeFromNum(this.audio.duration);
      this.audio.volume = 0.3;
      this.volumeRange.firstElementChild.style.width = '30%';
    });
  }

  //audio duration convertor
  getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${String(minutes).padStart(
      2,
      0
    )}:${String(seconds % 60).padStart(2, 0)}`;
  }

  // show current data
  updateData() {
    //  progress bar
    this.playRange.firstElementChild.style.width =
      (this.audio.currentTime / this.audio.duration) * 100 + '%';
    // current time
    this.nodeElement.querySelector('.current').textContent =
      this.getTimeCodeFromNum(this.audio.currentTime);
  }

  // toggle play button {
  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.stop();
    }
  }

  // toggle sound button
  toggleSound() {
    this.audio.muted = !this.audio.muted;
    if (this.audio.muted) {
      this.volumeBtn.firstElementChild.classList.remove('icono-volumeMedium');
      this.volumeBtn.firstElementChild.classList.add('icono-volumeMute');
      this.lastVolumeLevel = window.getComputedStyle(
        this.volumeRange.firstElementChild
      ).width;
      this.volumeRange.firstElementChild.style.width = '0%';
      console.log(this.lastVolumeLevel);
    } else {
      this.volumeBtn.firstElementChild.classList.add('icono-volumeMedium');
      this.volumeBtn.firstElementChild.classList.remove('icono-volumeMute');
      this.volumeRange.firstElementChild.style.width = this.lastVolumeLevel;
    }
  }

  // set current volume
  setVolume(e) {
    const sliderWidth = window.getComputedStyle(this.volumeRange).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    this.audio.volume = newVolume;
    this.volumeRange.firstElementChild.style.width = newVolume * 100 + '%';
  }

  // set play progress
  setPlay(e) {
    const sliderWidth = window.getComputedStyle(this.playRange).width;
    const newPlay = (e.offsetX / parseInt(sliderWidth)) * this.audio.duration;

    this.audio.currentTime = newPlay;
  }

  // play audio
  play() {
    this.playBtn.firstElementChild.classList.remove('play');
    this.playBtn.firstElementChild.classList.add('pause');
    this.audio.play();
    this.updateTimer = setInterval(this.updateData.bind(this), 20);
  }
  // stop audio
  stop() {
    this.playBtn.firstElementChild.classList.add('play');
    this.playBtn.firstElementChild.classList.remove('pause');
    this.audio.pause();
    clearInterval(this.updateTimer);
  }

  destroy() {
    //stop play
    if (!this.audio.paused) this.playBtn.dispatchEvent(new Event('click'));

    //clear player
    for (const key in this) {
      this[key] = null;
    }
  }
}
