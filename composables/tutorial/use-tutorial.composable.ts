import Shepherd from 'shepherd.js'
import { ComputedRef, ref, reactive, computed, useRouter, watch } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { flip, shift, limitShift, offset } from '@floating-ui/dom'
import { useSurvey } from '@/composables/survey/useSurvey.composable'
import type { Route, RawLocation } from 'vue-router'

export type TutorialStep = {
  step: Shepherd.Step.StepOptions
  advanceText?: string
  alternateOpeningTarget?: string /** CSS Selector for specifiying an alternate target for the modal opening */
  alternateOpeningTargetStyles?: Record<any, any>
  onAdvance?: () => void
  onShow?: (this: Shepherd.Step) => void
  onHide?: (this: Shepherd.Step) => void
  onBeforeShowPromise?: (this: Shepherd.Step.StepOptions) => Promise<any>
}

export type TutorialQueryParams ={
  tutorial?: boolean
  tutorialStep?: string | number
  tutorialIntroDaysRedirect?: boolean
  tutorialVirtualPreschoolRedirect?: boolean
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

  const pullTargetElementOut = (borderRadius = 6) => {
    if (!targetEl) {
      return
    }

    oldStyle = { ...targetEl.style }

    if (!['absolute', 'relative', 'fixed', 'sticky'].includes(targetEl.style.position)) {
      targetEl.style.setProperty('position', 'relative', 'important')
    }

    targetEl.style.setProperty('z-index', '14000', 'important')
    targetEl.style.setProperty('border-radius', `${borderRadius}px`, 'important')

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
        const tutorialStep = tutorialSteps.value.find((tutStep) => tutStep.step.id === this.id)
        return tutorialStep?.onBeforeShowPromise?.call(this) || new Promise((resolve) => {
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
          pullTargetElementOut(typeof this.options.modalOverlayOpeningRadius === 'number' ? this.options.modalOverlayOpeningRadius : undefined)

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
    const { tutorial, tutorialStep, tutorialWelcome, tutorialIntroDaysRedirect, tutorialVirtualPreschoolRedirect, name, params, ...query } = route.value.query
    return router.push({ name, params, query } as unknown as RawLocation)
  }

  function getQueryParamBooleanValue(value?: string | boolean) {
    if (value === undefined) {
      return value
    }

    if (typeof value === 'boolean') {
      return value
    }

    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return undefined
  }

  function getTutorialQueryParams() {
    const { tutorial, tutorialStep, tutorialIntroDaysRedirect, tutorialVirtualPreschoolRedirect } = route.value.query
    return {
      tutorial: getQueryParamBooleanValue(tutorial as string | undefined),
      tutorialStep: tutorialStep as string | undefined,
      tutorialIntroDaysRedirect: getQueryParamBooleanValue(tutorialIntroDaysRedirect as string | undefined),
      tutorialVirtualPreschoolRedirect: getQueryParamBooleanValue(tutorialVirtualPreschoolRedirect as string | undefined)
    }
  }

  const isInitialTutorial = computed(() => {
    return getQueryParamBooleanValue(route.value.query.tutorialIntroDaysRedirect as string | undefined)
  })

  function startIntroDays() {
    router.push({
      name: 'app-welcome',
      query: { fromQuestionnaire: 'true', step: '1' }
    })
  }

  return {
    shouldStartTutorial,
    isTutorial,
    tutorialStartStep,
    isInitialTutorial,
    getTutorialQueryParams,
    clearTutorialRouteParams,
    startIntroDays
  }
}

const quizResult = reactive({
  structuredLessons: false,
  liveClasses: false,
  printableWorksheets: false,
  educationalVideos: false
})

export const useTutorialQuiz = ({ store }: { store: Store<unknown> }) => {
  const survey = useSurvey({ store })

  function resetQuizResults() {
    quizResult.structuredLessons = true
    quizResult.liveClasses = true
    quizResult.printableWorksheets = true
    quizResult.educationalVideos = true
  }

  async function getQuizResults() {
    resetQuizResults()
    const result = await survey.getUserSurvey('POST-LOGIN-QUESTIONNAIRE')
    if (!result) {
      return
    }

    const page = result.surveyData.find((page: any) => page.order === 0)
    if (!page) {
      return
    }

    const question = page.questions[0]
    if (!question) {
      return
    }

    const answer = question.answer as string[]
    if (!answer || !answer.length) {
      return
    }

    quizResult.structuredLessons = answer.includes('Structured Online Preschool Lessons')
    quizResult.liveClasses = answer.includes('Live Zoom Classes')
    quizResult.printableWorksheets = answer.includes('Printable Worksheets')
    quizResult.educationalVideos = answer.includes('Educational videos to replace TV')
  }

  function turnOffQuiz() {
    quizResult.structuredLessons = false
    quizResult.liveClasses = false
    quizResult.printableWorksheets = false
    quizResult.educationalVideos = false
  }

  return {
    quizResult,
    getQuizResults,
    resetQuizResults,
    turnOffQuiz
  }
}

const shouldShowTutorialDialog = ref(false)
const dialogLoading = ref(false)
export const useTutorialDialog = () => {
  function showTutorialDialog() {
    shouldShowTutorialDialog.value = true
  }

  function closeTutorialDialog() {
    shouldShowTutorialDialog.value = false
  }

  return {
    shouldShowTutorialDialog,
    dialogLoading,
    showTutorialDialog,
    closeTutorialDialog
  }
}
