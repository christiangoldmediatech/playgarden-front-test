import { Entity } from '@/models'

export interface FAQCategory extends Entity {
  color: string
  description: string
  icon: string
  name: string
}

export interface FAQ extends Entity {
  answer: string
  question: string
  faqsCategory: FAQCategory
}
