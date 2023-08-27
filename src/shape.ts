type Matrix = number | Buffer | Matrix[]

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
  for (; Array.isArray(stack) || Buffer.isBuffer(stack); ) {
    shape.push(stack.length)
    stack = stack[0]
  }
  return shape
}

export function reshape(value: number[] | Buffer, shape: number[]): Matrix {
  let multi = shape.reduce((acc, c) => acc * c, 1)
  if (shape.length > 1) {
    let d = shape[0]
    let batch = multi / d
    let rest = shape.slice(1)
    let matrix = new Array(d)
    for (let i = 0, offset = 0; i < d; i++, offset += batch) {
      matrix[i] = reshape(value.slice(offset, offset + batch), rest)
    }
    return matrix
  }
  return value
}

export function flatten(value: Matrix): number[] {
  let result: number[] = []
  let stack: Matrix = [value]
  for (; stack.length > 0; ) {
    let buffer: Matrix = []
    for (let x of stack) {
      if (Array.isArray(x)) {
        buffer.push(x)
      } else if (Buffer.isBuffer(x)) {
        result.push(...x)
      } else {
        result.push(x)
      }
    }
    stack = buffer
  }
  return result
}
