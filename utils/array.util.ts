export const arrayToRecord = <T>(arr: T[], key: string): Record<number, T> => {
  const record = {} as Record<number, T>

  arr.forEach((element) => {
    // @ts-ignore
    record[element[key]] = element
  })

  return record
}
