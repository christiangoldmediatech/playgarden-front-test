// const container = document.getElementById(`js-background-video-container-${this._uid}`)
// let fullPlaylist

// const setupPlayer = () => {
  // let isReady = false

  // this.playerInstance = jwplayer(`children-player-${this._uid}`).setup({
  //   autostart: false,
  //   controls: false,
  //   playlist: fullPlaylist,
  //   mute: false,
  //   repeat: true,
  //   displaytitle: false,
  //   displaydescription: false,
  //   stretching: 'fill',
  //   height: '100%',
  //   width: '100%'
  // })

  // this.playerInstance.on('play', () => { this.playing = true })
  // this.playerInstance.on('pause', () => { this.playing = false })
  // this.playerInstance.on('idle', () => { this.playing = false })

  // this.playerInstance.on('time', ({ duration, position }) => {
  //   this.duration = duration
  //   this.position = position
  // })

  // this.playerInstance.on('firstFrame', () => container.classList.remove('is-fading'))

  // this.playerInstance.on('complete', () => { isReady = false })

  // this.playerInstance.on('time', (e) => {
  //   if (e.position >= (e.duration - 2) && !isReady) {
  //     isReady = true
  //     container.addClass('is-fading')
  //   }
  // })

  // container.addEventListener('transitionend', () => {
  //   if (!container.classList.contains('is-fading')) {
  //     let nextIndex = this.playerInstance.getPlaylistIndex() + 1
  //     nextIndex = nextIndex >= fullPlaylist.length ? 0 : nextIndex
  //     const posterImage = fullPlaylist[nextIndex].image
  //     const img = document.createElement('img')
  //     img.onload = () => { container.style.backgroundImage = `url(${posterImage})` }
  //     img.src = posterImage
  //   }
  // })

  // container.dispatchEvent(new Event('transitionend'))
// }

// fullPlaylist = data.playlist
