export default function (input, size, character = '0') {
  let s = input + ''

  while (s.length < size) {
    s = character + s
  }

  return s
}
