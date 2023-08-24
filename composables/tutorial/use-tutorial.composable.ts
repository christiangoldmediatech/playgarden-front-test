import Shepherd from 'shepherd.js'
import { Route, RawLocation } from 'vue-router'
import { ComputedRef, ref, computed, useRouter } from '@nuxtjs/composition-api'
import { flip, shift, limitShift, offset } from '@floating-ui/dom'

export type TutorialStep = {
  step: Shepherd.Step.StepOptions
  advanceText?: string
  alternateOpeningTarget?: string /** CSS Selector for specifiying an alternate target for the modal opening */
  alternateOpeningTargetStyles?: Record<any, any>
  onAdvance?: () => void
  onShow?: (this: Shepherd.Step) => void
  onHide?: (this: Shepherd.Step) => void
}

export type TutorialQueryParams ={
  tutorial?: boolean
  tutorialStep?: string | number
}

let tutorial: Shepherd.Tour | undefined
const tutorialSteps = ref<TutorialStep[]>([])
const currentTutorialStepId = ref<string>('')
const shouldCardExist = ref(false)

function createTutorial() {
  destroyTutorial()
  // Reset values
  tutorialSteps.value = []
  currentTutorialStepId.value = ''

  // For pulling target elements out of the normal flow
  let targetEl: any = ''
  let targetStyles: Record<any, any> = {}
  let oldStyle: any = ''

  const pullTargetElementOut = () => {
    if (!targetEl) {
      return
    }

    oldStyle = { ...targetEl.style }

    if (!['absolute', 'relative', 'fixed', 'sticky'].includes(targetEl.style.position)) {
      targetEl.style.setProperty('position', 'relative', 'important')
    }

    targetEl.style.setProperty('z-index', '9000', 'important')
    targetEl.style.setProperty('border-radius', '6px', 'important')

    Object.keys(targetStyles).forEach((cssKey) => {
      targetEl.style[cssKey] = targetStyles[cssKey]
    })
  }

  const returnTargetElement = () => {
    if (!targetEl) {
      return
    }
    targetEl.style = oldStyle
  }

  tutorial = new Shepherd.Tour({
    tourName: 'pg-tutorial',
    exitOnEsc: false,
    keyboardNavigation: false,
    useModalOverlay: true,
    stepsContainer: document.querySelector('.v-application') as HTMLElement,
    defaultStepOptions: {
      scrollTo: { behavior: 'smooth', block: 'center' },
      canClickTarget: false,
      title: undefined,
      text: undefined,
      modalOverlayOpeningRadius: 6,
      floatingUIOptions: {
        middleware: [
          offset(16),
          flip({
            crossAxis: false,
            fallbackPlacements: ['bottom', 'top', 'left', 'right']
          }),
          shift({
            limiter: limitShift(),
            crossAxis: true
          })
        ]
      },
      beforeShowPromise() {
        currentTutorialStepId.value = this.id || ''
        return new Promise((resolve) => {
          resolve(true)
        })
      },
      when: {
        show() {
          const tutorialStep = tutorialSteps.value.find((tutStep) => tutStep.step.id === this.id)

          // If supplied, set the actual modal opening differently
          const alternateOpeningTarget = tutorialStep && tutorialStep.alternateOpeningTarget && document.querySelector(tutorialStep.alternateOpeningTarget) as HTMLElement
          if (alternateOpeningTarget) {
            const tour = this.getTour() as Shepherd.Tour & { modal: any }
            tour.modal.setupForStep({
              tour,
              options: this.options,
              target: alternateOpeningTarget
            })
          }

          // Set the target for pulling element out of flow and later returning it
          targetEl = alternateOpeningTarget || this.getTarget()

          // Set additional styles
          const alternateOpeningTargetStyles = (tutorialStep && tutorialStep.alternateOpeningTargetStyles) || {}
          if (alternateOpeningTarget && this.options.canClickTarget !== true) {
            alternateOpeningTargetStyles.pointerEvents = 'none'
          }
          targetStyles = alternateOpeningTargetStyles

          // Set the z-index of the target element to avoid being obscured by other UI elements
          pullTargetElementOut()

          // Call custom onShow callback if supplied
          tutorialStep && tutorialStep.onShow && tutorialStep.onShow.call(this)

          // Finally, render the card
          shouldCardExist.value = true
        },
        hide() {
          // targetEl = this.getTarget()
          returnTargetElement()
          shouldCardExist.value = false
          const tutorialStep = tutorialSteps.value.find((tutStep) => tutStep.step.id === this.id)
          tutorialStep && tutorialStep.onHide && tutorialStep.onHide.call(this)
        }
      }
    }
  })

  const events = ['complete', 'cancel']
  events.forEach((event) => {
    tutorial?.on(event, returnTargetElement)
  })
}

function destroyTutorial() {
  if (tutorial?.isActive()) {
    tutorial.complete()
  }
  tutorial = undefined
  // observer?.disconnect()
  // observer = undefined
  shouldCardExist.value = false
}

function getTutorial() {
  return tutorial
}

function finishTutorial() {
  destroyTutorial()
  localStorage.setItem('pg-tutorial', JSON.stringify({ isFinished: true }))
}

function hasUserFinishedTutorial() {
  const storedValue = localStorage.getItem('pg-tutorial')
  if (!storedValue) {
    return false
  }
  const parsedStoredValue = JSON.parse(storedValue)
  return Boolean(parsedStoredValue?.isFinished)
}

export const useTutorial = () => {
  return {
    shouldCardExist,
    createTutorial,
    getTutorial,
    finishTutorial,
    hasUserFinishedTutorial,
    destroyTutorial
  }
}

function addTutorialSteps(steps: TutorialStep[]) {
  tutorialSteps.value = steps
  getTutorial()?.addSteps(steps.map(({ step }) => step))
}

export const useTutorialSteps = () => {
  const currentTutorialStep = computed(() => {
    return tutorialSteps.value.find((tutorialStep) => tutorialStep.step.id === currentTutorialStepId.value)
  })

  return {
    addTutorialSteps,
    tutorialSteps,
    currentTutorialStep
  }
}

export const useTutorialQuery = ({ route, router }: { route: ComputedRef<Route>, router: ReturnType<typeof useRouter> }) => {
  const shouldStartTutorial = computed(() => {
    const shouldStart = Boolean(route.value.query.tutorial)
    // return shouldStart && !hasUserFinishedTutorial()
    return shouldStart
  })

  const isTutorial = computed(() => {
    return Boolean(route.value.query.tutorial)
  })

  const tutorialStartStep = computed(() => {
    return route.value.query.tutorialStep
  })

  function clearTutorialRouteParams() {
    const { tutorial, tutorialStep, name, params, ...query } = route.value.query
    router.push({ name, params, query } as unknown as RawLocation)
  }

  return {
    shouldStartTutorial,
    isTutorial,
    tutorialStartStep,
    clearTutorialRouteParams
  }
}

// NOTE: The follow code has been removed, but testing is still be done to ensure it is no longer needed.
// shepherd js is always creating and destroying the .shepherd-element HTMLElement
// this detects the changes and moves it so that it is positioned under .v-application
// that way our card is correctly styled
// let observer: MutationObserver | undefined
// const observerCallback = () => {
//   const shepEl = document.querySelector('body > .shepherd-element')
//   const vApp = document.querySelector('.v-application')
//   if (!shepEl || !vApp) {
//     return
//   }

//   const oldShepEl = vApp?.querySelector('.shepherd-element')
//   if (oldShepEl) {
//     oldShepEl.remove()
//   }

//   vApp.appendChild(shepEl)
//   window.setTimeout(() => {}, 0)
//   shouldCardExist.value = true
// }
// observer = new MutationObserver(observerCallback)
// observer.observe(document.body, { childList: true, attributes: false, subtree: false })
