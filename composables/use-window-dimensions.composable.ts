// Utility functions for easily and accurately determining window width and height
import { ref, Ref } from '@nuxtjs/composition-api'
import { DebouncedFunc, throttle } from 'lodash'

// Update as needed
const APP_BAR_HEIGHT = 98

// Global variables for storing dimensions
const windowWidth = ref(
  document.documentElement.clientWidth || window.innerWidth || 0
)
const windowHeight = ref(
  document.documentElement.clientHeight || window.innerHeight || 0
)

// Global functions for getting dimensions
function updateWindowWidth(): void {
  windowWidth.value =
    document.documentElement.clientWidth || window.innerWidth || 0
}

function updateWindowHeight(): void {
  windowHeight.value =
    document.documentElement.clientHeight || window.innerHeight || 0
}

function updateWindowDimensions(): void {
  windowWidth.value =
    document.documentElement.clientWidth || window.innerWidth || 0
  windowHeight.value =
    document.documentElement.clientHeight || window.innerHeight || 0
}

// Throttled functions intended for event listeners
const throttledWindowWidth = throttle(updateWindowWidth, 16)
const throttledWindowHeight = throttle(updateWindowHeight, 16)
const throttledWindowDimensions = throttle(updateWindowDimensions, 16)

// Functions for easily configuring event listeners
const mql = window.matchMedia('(orientation: portrait)')

function addWindowDimensionListeners(): void {
  if (window) {
    window.addEventListener('resize', throttledWindowDimensions)
  }

  if (mql) {
    mql.addEventListener('change', updateWindowDimensions)
  }
}

function removeWindowDimensionListeners(): void {
  if (window) {
    window.removeEventListener('resize', throttledWindowDimensions)
  }

  if (mql) {
    mql.removeEventListener('change', updateWindowDimensions)
  }
}

// Functions for getting element dimensions
function getElementDimensions(selector: string): { x: number, y: number } {
  const elem = document.querySelector(selector)
  if (elem) {
    return {
      x: elem.clientWidth || 0,
      y: elem.clientHeight || 0
    }
  }
  return {
    x: 0,
    y: 0
  }
}

function generateUpdaterFunctions(selector: string, x: Ref<number>, y: Ref<Number>) {
  const getDimensions = () => {
    const dimensions = getElementDimensions(selector)
    x.value = dimensions.x
    y.value = dimensions.y
  }

  return {
    updater: getDimensions,
    throttled: throttle(getDimensions, 16)
  }
}

function addElementDimensionListeners(updater: () => any, throttledUpdater: DebouncedFunc<() => any>): void {
  if (window) {
    window.addEventListener('resize', throttledUpdater)
  }

  if (mql) {
    mql.addEventListener('change', updater)
  }
}

function removeElementDimensionListeners(updater: () => any, throttledUpdater: DebouncedFunc<() => any>): void {
  if (window) {
    window.removeEventListener('resize', throttledUpdater)
  }

  if (mql) {
    mql.removeEventListener('change', updater)
  }
}

export const useWindowDimensions = () => {
  return {
    APP_BAR_HEIGHT,
    windowWidth,
    windowHeight,
    updateWindowHeight,
    updateWindowWidth,
    updateWindowDimensions,
    throttledWindowWidth,
    throttledWindowHeight,
    throttledWindowDimensions,
    addWindowDimensionListeners,
    removeWindowDimensionListeners,
    getElementDimensions,
    generateUpdaterFunctions,
    addElementDimensionListeners,
    removeElementDimensionListeners
  }
}
