import { Network, randomActivation, randomValue } from './nn'

let { random } = Math

let compete_output: [stronger: Network, weaker: Network] = [] as any

export type CompeteFn = (
  a: Network,
  b: Network,
  output: [stronger: Network, weaker: Network],
) => boolean

let Crossover_Chance = 0.5

export function evolve(compete: CompeteFn, a: Network, b: Network) {
  if (!compete(a, b, compete_output)) {
    return
  }

  // a is stronger than b
  ;[a, b] = compete_output

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
