import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import { setupComponent } from '@/utils'

const studentCubbyItemsList = [
  {
    text: 'PUZZLE',
    title: 'STUDENTS CUBBY',
    routeName: 'app-student-cubby-puzzle'
  },
  {
    text: 'CURRICULUM',
    title: 'Review all Curriculum',
    routeName: 'app-student-cubby-course-progress'
  }
]

describe('components/app/student-cubby/StudentCubbyItems.vue', () => {
  const { mountFunction } = setupComponent(StudentCubbyItems, {
    stubs: {
      PgSelect: true
    },
    propsData: {
      isMobile: false,
      selectedChildId: 0,
      items: JSON.parse(JSON.stringify(studentCubbyItemsList))
    }
  })

  it('mounts the component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  describe('given the user is on desktop', () => {
    it('shows desktop navigation bar', () => {
      const wrapper = mountFunction({
        propsData: {
          isMobile: false
        }
      })

      const bar = wrapper.find('[data-test-id=student-cubby-bar]')

      expect(bar.exists()).toBeTruthy()
    })

    it('renders each item passed as prop', () => {
      const wrapper = mountFunction({
        propsData: {
          isMobile: false
        }
      })

      const barItems = wrapper.findAll('[data-test-id*=student-cubby-item]')

      expect(barItems.length).toEqual(studentCubbyItemsList.length)
    })
  })

  describe('given the user is on mobile', () => {
    it('shows mobile select list', () => {
      const wrapper = mountFunction({
        propsData: {
          isMobile: true
        }
      })

      const select = wrapper.find('[data-test-id=student-cubby-select]')

      expect(select.exists()).toBeTruthy()
    })
  })
})
