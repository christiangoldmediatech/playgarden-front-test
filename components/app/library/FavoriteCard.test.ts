import FavoriteCard from '@/components/app/library/FavoriteCard.vue'
import { setupComponent } from '@/utils'

describe('components/app/library/FavoriteCard.vue', () => {
  const { mountFunction } = setupComponent(FavoriteCard, {
    propsData: {
      videoId: 1,
      thumbnail: '',
      title: '',
      teacher: ''
    }
  })

  it('should mount component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  it('displays given thumbnail prop', () => {
    const wrapper = mountFunction({
      propsData: {
        thumbnail: '/some-path/'
      }
    })
    const thumbnail = wrapper.find('[data-test-id=favorite-card-thumbnail]')

    expect(thumbnail.props().src).toEqual('/some-path/')
  })

  it('displays given title prop', () => {
    const wrapper = mountFunction({
      propsData: {
        title: 'Some Title'
      }
    })
    const title = wrapper.find('[data-test-id=favorite-card-title]')

    expect(title.text()).toEqual('Some Title')
  })

  it('displays given teacher prop', () => {
    const wrapper = mountFunction({
      propsData: {
        teacher: 'Some Teacher'
      }
    })
    const teacher = wrapper.find('[data-test-id=favorite-card-teacher]')

    expect(teacher.text()).toEqual('with Some Teacher')
  })
})
