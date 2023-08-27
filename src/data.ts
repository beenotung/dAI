import { readFileSync } from 'fs'

export function loadData(file: string, offset: number) {
  return readFileSync(file).slice(offset)
}

export function loadLabels() {
  return loadData('res/train-labels-idx1-ubyte', 8)
}

export function loadInputs() {
  return loadData('res/train-images-idx3-ubyte', 16)
}
