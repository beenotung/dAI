import {
  Network,
  NetworkSpec,
  randomActivation,
  randomValue,
  runNetwork,
} from './nn'
let { random } = Math

export type Gene = {
  network: Network
  spec: NetworkSpec
  fitness: number
}

export function fitness(network: Network): number {
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

let Crossover_Chance = 0.5

export function compete(a: Network, b: Network) {
  let aFitness = fitness(a)
  let bFitness = fitness(b)
  if (aFitness === bFitness) {
    return
  }
  // a is stronger than b
  if (aFitness < bFitness) {
    ;[a, b] = [b, a]
  }
  if (random() < Crossover_Chance) {
    crossover(a, b)
  } else {
    mutate(a, b)
  }
}

let Crossover_Inject_Chance = 0.5

// inject gene from a to b
function crossover(a: Network, b: Network): void {
  let N_Layer = a.biases.length
  for (let i_layer = 0; i_layer < N_Layer; i_layer++) {
    let a_activations = a.activations[i_layer]
    let a_biases = a.biases[i_layer]
    let a_weights = a.weights[i_layer]

    let b_activations = b.activations[i_layer]
    let b_biases = b.biases[i_layer]
    let b_weights = b.weights[i_layer]

    let N_Output = b_biases.length
    let N_Input = b_weights[0].length

    for (let i_output = 0; i_output < N_Output; i_output++) {
      if (random() < Crossover_Inject_Chance) {
        b_activations[i_output] = a_activations[i_output]
      }
      if (random() < Crossover_Inject_Chance) {
        b_biases[i_output] = a_biases[i_output]
      }
      let a_ws = a_weights[i_output]
      let b_ws = b_weights[i_output]
      for (let i_input = 0; i_input < N_Input; i_input++) {
        if (random() < Crossover_Inject_Chance) {
          b_ws[i_input] = a_ws[i_input]
        }
      }
    }
  }
}

let Mutate_Chance = 0.02
let Mutate_Amount = 0.05

// mutate gene from a and save to b
function mutate(a: Network, b: Network): void {
  let N_Layer = a.biases.length
  for (let i_layer = 0; i_layer < N_Layer; i_layer++) {
    let a_activations = a.activations[i_layer]
    let a_biases = a.biases[i_layer]
    let a_weights = a.weights[i_layer]

    let b_activations = b.activations[i_layer]
    let b_biases = b.biases[i_layer]
    let b_weights = b.weights[i_layer]

    let N_Output = b_biases.length
    let N_Input = b_weights[0].length

    for (let i_output = 0; i_output < N_Output; i_output++) {
      if (random() < Mutate_Chance) {
        b_activations[i_output] = randomActivation()
      } else {
        b_activations[i_output] = a_activations[i_output]
      }

      let bias = a_biases[i_output]
      if (random() < Mutate_Chance) {
        bias += randomValue() * Mutate_Amount
      }
      b_biases[i_output] = bias

      let a_ws = a_weights[i_output]
      let b_ws = b_weights[i_output]
      for (let i_input = 0; i_input < N_Input; i_input++) {
        let weight = a_ws[i_input]
        if (random() < Mutate_Chance) {
          weight += randomValue() * Mutate_Amount
        }
        b_ws[i_input] = weight
      }
    }
  }
}
