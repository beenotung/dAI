import { randomNetwork } from './nn'

let model = randomNetwork({
  input_d: 2,
  hidden_ds: [2],
  output_d: 1,
})

console.dir(model, { depth: 20 })
