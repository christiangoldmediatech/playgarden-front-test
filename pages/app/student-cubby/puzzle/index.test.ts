import Index from '@/pages/app/student-cubby/puzzle/index.vue'
import { setupComponent } from '@/utils'

describe('components/app/library/ActivityCard.vue', () => {
  const { mountFunction } = setupComponent(Index, {
    propsData: {}
  })

  it('should mount component', () => {
    const wrapper = mountFunction()
    expect(wrapper).toBeTruthy()
  })
})
