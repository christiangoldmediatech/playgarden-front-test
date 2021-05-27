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

  describe('given the user is on desktop', () => {
    it('shows desktop navigation bar')
    it('renders each item passed as prop')
  })

  describe('given the user is on mobile', () => {
    it('shows mobile select list')
    it('renders each item passed as prop')
  })
})
