// this export is used in the composable
import { en as question1 } from './question1.locales.json'
import { en as question2 } from './question2.locales.json'
import { en as question3and4 } from './question3.locales.json'

export default {
  question1,
  question2,
  question3: question3and4.question3,
  question4: question3and4.question4
}
