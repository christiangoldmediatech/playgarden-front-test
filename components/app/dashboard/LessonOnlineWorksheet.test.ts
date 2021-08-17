import LessonOnlineWorksheet from '@/components/app/dashboard/LessonOnlineWorksheet.vue'
import { setupComponent } from '@/utils'

describe('components/app/dashboard/LessonOnlineWorksheet.vue', () => {
  const onlineWorksheet = {
    name: 'Letter A Food'
  }

  const { mountFunction } = setupComponent(LessonOnlineWorksheet, {
    propsData: {
      onlineWorksheet: { ...onlineWorksheet }
    }
  })

  it('mounts the component', () => {
    const wrapper = mountFunction()
    expect(wrapper).toBeTruthy()
  })

  it('displays worksheet name', () => {
    const wrapper = mountFunction()
    const name = wrapper.find('[data-test-id=lesson-online-worksheet-name]')

    expect(name.text()).toEqual(onlineWorksheet.name)
  })

  it('should disable the card if the progress is < 100', () => {
    const wrapper = mountFunction({
      propsData: {
        progress: 50
      }
    })
    const card = wrapper.find('[data-test-id=lesson-online-worksheet-card]')
    const cardName = wrapper.find('[data-test-id=lesson-online-worksheet-name]')

    expect(card.classes()).toContain('v-card--disabled')
    expect(cardName.classes()).toContain('dashboard-item-disabled')
  })
})
