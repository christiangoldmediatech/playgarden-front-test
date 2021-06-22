import Index from '@/pages/app/student-cubby/puzzle/index.vue'
import { shallowMount } from '@vue/test-utils'

test('displays message', () => {
  // mount() returns a wrapped Vue component we can interact with
  const wrapper = shallowMount(Index, {
    data () {
      return {
        dialog: false,
        toShow: {},
        children: [{
          id: 135,
          firstName: 'Test'
        }]
      }
    },
    mocks: {
      $router: {
        parameter: { id: 135 },
        query: { id: 135 }
      }
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('div')
})
