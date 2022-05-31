import { Network, NetworkSpec, randomNetwork } from './nn'
import { bestFitness, evolve, sampleFitness } from './pool'

let spec: NetworkSpec = {
  input_d: 2,
  hidden_ds: [2],
  output_d: 1,
}

let pool_size = 100
let pool: Network[] = new Array(pool_size)
for (let i = 0; i < pool_size; i++) {
  pool[i] = randomNetwork(spec)
}

let N_Round = 2_500
let Sample_Batch = 100
for (let i = 0; i < N_Round; i++) {
  evolve(pool)
  if (i % Sample_Batch === 0) {
    console.log('round', i, 'sample fitness:', sampleFitness(pool))
    // console.log('round', i, 'best fitness:', bestFitness(pool))
  }
}
console.dir(pool[0], { depth: 20 })
