import { expect } from 'chai'
import { getShape, reshape } from './shape'

describe('getShape', () => {
  it('should get shape of 1d vector', () => {
    expect(getShape([1, 2, 3])).deep.equals([3])
  })
  it('should get shape of 2d matrix', () => {
    expect(
      getShape([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).deep.equals([2, 3])
  })
  it('should get shape of 3d matrix', () => {
    expect(
      getShape([
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
      ]),
    ).deep.equals([4, 2, 3])
  })
  it('should get shape of 4d dataset', () => {
    expect(
      getShape([
        [
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
        ],
      ]),
    ).deep.equals([1, 4, 2, 3])
  })
})

describe('reshape', () => {
  // TODO
})
describe('flatten', () => {
  // TODO
})
