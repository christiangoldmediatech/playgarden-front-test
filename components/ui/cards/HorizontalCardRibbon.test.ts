import HorizontalCardRibbon from '@/components/ui/cards/HorizontalCardRibbon.vue'
import { setupComponent } from '@/utils'

describe('components/ui/cards/HorizontalCardRibbon', () => {
  const { mountFunction } = setupComponent(HorizontalCardRibbon)

  it('mounts the component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  it('emits `isMinimized` on minimize button click', async () => {
    const wrapper = mountFunction()
    const minimizeButtton = wrapper.find('[data-test-id=minimize-button]')
    await minimizeButtton.trigger('click')

    expect(wrapper.emitted()['update:isMinimized']).toBeTruthy()
  })

  it('hides content when minimized', () => {
    const wrapper = mountFunction({
      propsData: {
        isMinimized: true
      }
    })

    const content = wrapper.find('[data-test-id=content]')
    expect(content.exists()).toBe(true)
    expect(content.isVisible()).toBe(false)
  })
})
