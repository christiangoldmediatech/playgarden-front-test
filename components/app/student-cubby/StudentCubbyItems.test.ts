import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import { setupComponent } from '@/utils'

describe('components/app/student-cubby/StudentCubbyItems.vue', () => {
  const { mountFunction } = setupComponent(StudentCubbyItems, {
    propsData: {
      selectedChildId: 0,
      items: []
    }
  })

  it('mounts the component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })
})
