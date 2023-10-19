import { useLanguageHelper } from '@/composables'

export const useLocalLanguageHelper = () => {
  const language = useLanguageHelper()

  function getLocalT(prefix: string) {
    return (...args: any[]) => {
      return language.t(`LocalComponentTranslations.${prefix}.${args[0]}`, ...args.slice(1))
    }
  }

  return {
    getLocalT
  }
}
