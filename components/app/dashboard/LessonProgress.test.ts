import LessonProgress from '@/components/app/dashboard/LessonProgress.vue'
import { setupComponent } from '@/utils'

describe('components/app/dashboard/LessonProgress.vue', () => {
  const { mountFunction } = setupComponent(LessonProgress)

  it('mounts the component', () => {
    const wrapper = mountFunction()
    expect(wrapper).toBeTruthy()
  })

  describe('given the progress is not complete', () => {
    it('should say "Win a puzzle piece!"', () => {
      const wrapper = mountFunction({
        propsData: {
          progress: 0
        }
      })
      const message = wrapper.find('[data-test-id=lesson-progress-message]')

      expect(message.text()).toEqual('Win a puzzle piece!')
    })

    it('should not show completed medal', () => {
      const wrapper = mountFunction({
        propsData: {
          progress: 0
        }
      })
      const medal = wrapper.find('[data-test-id=lesson-progress-medal]')

      expect(medal.exists()).toBeFalsy()
    })

    describe('given it is a worksheet progress', () => {
      it('should show text with remaining worksheets', () => {
        const wrapper = mountFunction({
          propsData: {
            isWorksheetProgress: true,
            totalCompletedWorksheets: 1,
            totalWorksheets: 3,
            progress: 0
          }
        })
        const progress = wrapper.find(
          '[data-test-id=lesson-progress-worksheets]'
        )

        expect(progress.text()).toEqual('1/3')
      })
    })
  })

  describe('given the progress is complete', () => {
    it('should say "You earned a puzzle piece"', () => {
      const wrapper = mountFunction({
        propsData: {
          progress: 100
        }
      })
      const message = wrapper.find('[data-test-id=lesson-progress-message]')

      expect(message.text()).toEqual('You earned a puzzle piece')
    })

    it('should show completed medal', () => {
      const wrapper = mountFunction({
        propsData: {
          progress: 100
        }
      })
      const medal = wrapper.find('[data-test-id=lesson-progress-medal]')

      expect(medal.exists()).toBeTruthy()
    })
  })
})
