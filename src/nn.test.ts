import { Network, runNetwork } from './nn'

let model: Network = {
  weights: [
    [
      [20, 20],
      [-20, -20],
    ],
    [[20, 20]],
  ],
  biases: [[-10, 30], [-30]],
}

function test(inputs: number[]) {
  let outputs = runNetwork(model, inputs)
  console.log(inputs, '->', outputs)
}

test([1, 1])
test([1, 0])
test([0, 1])
test([0, 0])
