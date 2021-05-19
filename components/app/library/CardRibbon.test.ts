import CardRibbon from '@/components/app/library/CardRibbon.vue'
import { setupComponent } from '@/utils'

describe('components/app/library/RibbonCard.vue', () => {
  const { mountFunction } = setupComponent(CardRibbon, {
    propsData: {
      text: 'Viewed'
    }
  })

  it('should mount component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  it('should show `text` prop as content', () => {
    const customText = 'Some Custom Text'
    const wrapper = mountFunction({
      propsData: {
        text: customText
      }
    })
    const content = wrapper.find('span')

    expect(wrapper.text()).toEqual(customText)
  })
})
