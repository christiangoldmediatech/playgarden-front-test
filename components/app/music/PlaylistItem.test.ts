import PlaylistItem from '@/components/app/music/PlaylistItem.vue'
import { setupComponent } from '@/utils'

describe('components/app/music/PlaylistItem.vue', () => {
  const song = {
    description: 'Letter A'
  }

  const favoriteSong = {
    isFavorite: true
  }

  const { mountFunction } = setupComponent(PlaylistItem, {
    propsData: {
      song
    }
  })

  it('Should mount the component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  it('Should show song description', () => {
    const wrapper = mountFunction()
    const description = wrapper.find('[data-test-id=playlist-item-song-description]')

    expect(description.text()).toEqual(song.description)
  })

  it('Should emit `play` on card click', async () => {
    const wrapper = mountFunction()
    const item = wrapper.find('[data-test-id=playlist-item]')

    await item.trigger('click')

    expect(wrapper.emitted().play).toBeTruthy()
  })

  it('Should emit `favorite` when favorite button is clicked', async () => {
    const wrapper = mountFunction()
    const favoriteButton = wrapper.find('[data-test-id=playlist-item-favorite-button]')

    await favoriteButton.trigger('click')

    expect(wrapper.emitted().favorite).toBeTruthy()
  })

  it('Should emit `remove-song` when remove button is clicked', async () => {
    const wrapper = mountFunction()
    const removeButton = wrapper.find('[data-test-id=playlist-item-remove-button]')

    await removeButton.trigger('click')

    expect(wrapper.emitted()['remove-song']).toBeTruthy()
  })

  describe('Given the song is playing', () => {
    it('Should show the playing tag', () => {
      const wrapper = mountFunction({
        propsData: {
          isPlaying: true
        }
      })
      const playingTag = wrapper.find('[data-test-id=playlist-item-playing-tag]')

      expect(playingTag.exists()).toBeTruthy()
    })

    it('Should not show the song name', () => {
      const wrapper = mountFunction({
        propsData: {
          isPlaying: true
        }
      })
      const songName = wrapper.find('[data-test-id=playlist-item-song-name]')

      expect(songName.exists()).toBeFalsy()
    })
  })

  describe('Given the song is favorite', () => {
    it('Should show heart icon in pink', () => {
      const wrapper = mountFunction({
        propsData: {
          song: favoriteSong
        }
      })
      const heartIcon = wrapper.find('[data-test-id=playlist-item-favorite-button]')

      expect(heartIcon.classes()).toContain('pink--text')
      expect(heartIcon.classes()).toContain('text--lighten-2')
    })
  })

  describe('Given the song is not favorite', () => {
    it('Should show heart icon without pink', () => {
      const wrapper = mountFunction({
        propsData: {
          song
        }
      })
      const heartIcon = wrapper.find('[data-test-id=playlist-item-favorite-button]')

      expect(heartIcon.classes()).not.toContain('pink--text')
      expect(heartIcon.classes()).not.toContain('text--lighten-2')
    })
  })
})
