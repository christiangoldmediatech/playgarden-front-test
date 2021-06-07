import dayjs from 'dayjs'
import { getCountdownToDate } from '@/utils/dateTools'

describe('utils/dateTools.js', () => {
  describe('getCountdownToDate', () => {
    describe('given future dates', () => {
      it('should return remaining days with format #:00:00', () => {
        const oneDayLater = dayjs().add(1, 'day').add(1, 'second')

        expect(getCountdownToDate(oneDayLater)).toEqual('1:00:00')
      })

      it('should return remaining hours with format 0:##:00', () => {
        const oneHourLater = dayjs().add(1, 'hour').add(1, 'second')

        expect(getCountdownToDate(oneHourLater)).toEqual('0:01:00')
      })

      it('should return remaining hours with format 0:00:##', () => {
        const oneMinuteLater = dayjs().add(1, 'minute').add(1, 'second')

        expect(getCountdownToDate(oneMinuteLater)).toEqual('0:00:01')
      })
    })

    describe('given past dates', () => {
      it('should return 0:00:00', () => {
        const pastDay = dayjs().subtract(1, 'day')

        expect(getCountdownToDate(pastDay)).toEqual('0:00:00')
      })
    })
  })
})
