import ActivityCard from '@/components/app/library/ActivityCard.vue'
import { setupComponent } from '@/utils'

const $appEventBus = {
  $on: () => {
    return new Promise((resolve) => {
      resolve({})
    })
  },
  $off: () => {
    return new Promise((resolve) => {
      resolve({})
    })
  },
  $emit: (data: unknown) => {
    return new Promise((resolve) => {
      resolve({ data })
    })
  }
}

describe('components/app/library/ActivityCard.vue', () => {
  const { mountFunction } = setupComponent(ActivityCard, {
    propsData: {
      videoId: 1,
      thumbnail: '',
      activityTypeIcon: '',
      category: '',
      title: '',
      teacher: '',
      viewed: false
    },
    mocks: {
      $appEventBus
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
    const thumbnail = wrapper.find('[data-test-id=activity-card-thumbnail]')

    expect(thumbnail.props().src).toEqual('/some-path/')
  })

  it('displays given activityTypeIcon prop', () => {
    const wrapper = mountFunction({
      propsData: {
        activityTypeIcon: '/some-path/'
      }
    })
    const activityTypeIcon = wrapper.find('[data-test-id=activity-card-activity-type-icon]')

    expect(activityTypeIcon.props().src).toEqual('/some-path/')
  })

  it('displays given title prop', () => {
    const wrapper = mountFunction({
      propsData: {
        title: 'Some Title'
      }
    })
    const title = wrapper.find('[data-test-id=activity-card-title]')

    expect(title.text()).toEqual('Some Title')
  })

  it('displays given teacher prop', () => {
    const wrapper = mountFunction({
      propsData: {
        teacher: 'Some Teacher'
      }
    })
    const teacher = wrapper.find('[data-test-id=activity-card-teacher]')

    expect(teacher.text()).toEqual('with Some Teacher')
  })

  describe('given `viewed` prop is true', () => {
    it('displays VIEWED ribbon', () => {
      const wrapper = mountFunction({
        propsData: {
          viewed: true
        }
      })
      const ribbon = wrapper.find('[data-test-id=activity-card-ribbon]')

      expect(ribbon.exists()).toBeTruthy()
    })
  })

  describe('given `viewed` prop is false', () => {
    it('hides VIEWED ribbon', () => {
      const wrapper = mountFunction({
        propsData: {
          viewed: false
        }
      })
      const ribbon = wrapper.find('[data-test-id=activity-card-ribbon]')

      expect(ribbon.exists()).toBeFalsy()
    })
  })
})
