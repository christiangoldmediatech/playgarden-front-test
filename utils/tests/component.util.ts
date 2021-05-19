import Vuetify from 'vuetify'
import Vue from 'vue'
import {
  shallowMount,
  mount,
  createLocalVue,
  ThisTypedShallowMountOptions,
  ThisTypedMountOptions
} from '@vue/test-utils'

type MountOptions =
  | ThisTypedShallowMountOptions<Vue>
  | ThisTypedMountOptions<Vue>

const createInstanceProperties = (
  setupPayload?: MountOptions,
  payload?: MountOptions
): MountOptions => ({
  localVue: createLocalVue(),
  vuetify: new Vuetify(),
  mocks: {
    ...setupPayload?.mocks,
    ...payload?.mocks
  },
  stubs: {
    ...setupPayload?.stubs,
    ...payload?.stubs
  },
  components: {
    ...setupPayload?.components,
    ...payload?.components
  },
  propsData: {
    ...setupPayload?.propsData,
    ...payload?.propsData
  },
  beforeMount:
    typeof payload?.beforeMount === 'function'
      ? payload.beforeMount
      : setupPayload?.beforeMount
  /**
   * This covers the majority of test cases, but if some other mount/shallowMount
   * property is going to be used, it should be added here so it is resolved
   * when creating the mountFunction or the shallowMountFunction.
   */
})

export const setupComponent = (component: any, setupPayload?: MountOptions) => {
  Vue.use(Vuetify, {})

  const shallowMountFunction = (
    payload?: ThisTypedShallowMountOptions<Vue>
  ) => {
    return shallowMount(component, {
      ...createInstanceProperties(setupPayload, payload)
    })
  }

  const mountFunction = (payload?: ThisTypedMountOptions<Vue>) => {
    return mount(component, {
      ...createInstanceProperties(setupPayload, payload)
    })
  }

  return {
    shallowMountFunction,
    mountFunction
  }
}
