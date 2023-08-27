type Matrix = number | Matrix[]

export function count(value: Matrix): number {
  let n = 0
  let stack: Matrix = [value]
  for (; stack.length > 0; ) {
    let buffer: Matrix = []
    for (let x of stack) {
      if (Array.isArray(x)) {
        buffer.push(...x)
      } else {
        n++
      }
    }
    stack = buffer
  }
  return n
}

export function getShape(values: Matrix): number[] {
  let shape: number[] = []
  let stack: Matrix = values
  for (; Array.isArray(stack); ) {
    shape.push(stack.length)
    stack = stack[0]
  }
  return shape
}
