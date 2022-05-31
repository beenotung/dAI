import { Network, NetworkSpec, randomNetwork, runNetwork } from './nn'
import { isRealNumber } from './number'
import { evolvePool } from './pool'

let { random, max } = Math

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
  evolvePool(compete, pool)
  if (i % Sample_Batch === 0) {
    console.log('round', i, 'sample fitness:', sampleFitness(pool))
    // console.log('round', i, 'best fitness:', bestFitness(pool))
  }
}
console.dir(pool[0], { depth: 20 })

function fitness(network: Network): number {
  return fitness_xor(network)
}

function fitness_bmi(network: Network): number {
  let N_Sample = 100
  let acc = 0
  for (let i_sample = 0; i_sample < N_Sample; i_sample++) {
    let kg = random() * 200 + 1
    let m = random() * 2
    let bmi = kg / m ** 2

    let underweight = bmi < 18.5 ? 1 : 0
    let normal_weight = bmi >= 18.5 && bmi < 25 ? 1 : 0
    let overweight = bmi >= 25 && bmi < 30 ? 1 : 0
    let obesity_1 = bmi >= 30 && bmi < 35 ? 1 : 0
    let obesity_2 = bmi >= 35 && bmi < 40 ? 1 : 0
    let obesity_3 = bmi >= 40 ? 1 : 0
    let ys = [
      underweight,
      normal_weight,
      overweight,
      obesity_1,
      obesity_2,
      obesity_3,
    ]

    let inputs = [kg, m, kg * kg, m * m, 1 / kg, 1 / m]
    let outputs = runNetwork(network, inputs)

    let e_acc = 0
    ys.forEach((y, i) => {
      let e = y - outputs[i]
      e_acc += e * e
    })

    acc += e_acc
  }
  let mse = acc / N_Sample
  return 1 / (mse + 1)
}

function fitness_xor(network: Network): number {
  let N_Sample = 100
  let acc = 0
  for (let i_sample = 0; i_sample < N_Sample; i_sample++) {
    let a = random() < 0.5
    let b = random() < 0.5
    let c = a && b ? false : !a && !b ? false : a || b

    let x1 = a ? 1 : -1
    let x2 = b ? 1 : -1
    let y1 = c ? 1 : -1

    let inputs = [x1, x2]
    let outputs = runNetwork(network, inputs)
    let e = y1 - outputs[0]
    acc += e * e
  }
  let mse = acc / N_Sample
  return 1 / (mse + 1)
}

function compete(
  a: Network,
  b: Network,
  output: [stronger: Network, weaker: Network],
): boolean {
  let aFitness = fitness(a)
  let bFitness = fitness(b)

  let aIsValid = isRealNumber(aFitness)
  let bIsValid = isRealNumber(bFitness)

  if (aIsValid && !bIsValid) {
    output[0] = a
    output[1] = b
    return true
  }

  if (!aIsValid && bIsValid) {
    output[0] = b
    output[1] = a
    return true
  }

  if (aFitness === bFitness) {
    return false
  }
  if (aFitness > bFitness) {
    output[0] = a
    output[1] = b
  } else {
    output[0] = b
    output[1] = a
  }
  return true
}

function sampleFitness(pool: Network[]): number {
  return fitness(pool[0])
}

function bestFitness(pool: Network[]): number {
  let bestFitness = 0
  pool.forEach(network => {
    bestFitness = max(bestFitness, fitness(network))
  })
  return bestFitness
}
