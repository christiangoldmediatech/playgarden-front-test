import Vue from 'vue'
import Vuetify from 'vuetify'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { mount, createLocalVue } from '@vue/test-utils'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('components/ui/LargeImageContentDialog/LargeImageContentDialog.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountFunction = (props = {}, slots = {}) => mount(LargeImageContentDialog, {
    localVue,
    vuetify,
    slots: {
      ...slots
    },
    stubs: {
      PgDialog: true
    },
    propsData: {
      value: false,
      img: '',
      ...props
    }
  })

  it('should mount the component', () => {
    const wrapper = mountFunction()

    expect(wrapper).toBeTruthy()
  })

  it('should emit `close` on close button click on desktop', async () => {
    const wrapper = mountFunction()
    wrapper.vm.$vuetify.breakpoint.mobile = false // set viewport detection to desktop

    await wrapper.find('[data-test-id=desktop-close-button]').trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('should emit `close` on close button click on mobile', async () => {
    const wrapper = mountFunction()

    await wrapper.find('[data-test-id=mobile-close-button]').trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('should render `default` slot content', () => {
    const wrapper = mountFunction({}, {
      default: '<div data-test-id="default-slot-content">This is a test slot</div>'
    })

    const content = wrapper.find('[data-test-id=default-slot-content]')

    expect(content.exists()).toBeTruthy()
    expect(content.text()).toBe('This is a test slot')
  })

  it('should render image passed as prop', () => {
    const wrapper = mountFunction({ img: '/some/path.png' })

    const img = wrapper.find('[data-test-id=image]')

    expect(img.props().src).toBe('/some/path.png')
  })
})
