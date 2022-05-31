let { floor, exp, tanh, random } = Math

export type Network = {
  // layer -> output node -> activation function
  activations: Activation[][]

  // layer -> output node -> input node -> weight
  weights: number[][][]

  // layer -> output node -> bias
  biases: number[][]
}

export type NetworkSpec = {
  input_d: number
  hidden_ds: number[]
  output_d: number
}

export function randomNetwork(spec: NetworkSpec): Network {
  let layer_ds = [...spec.hidden_ds, spec.output_d]

  let N_Layer = layer_ds.length

  let weights: number[][][] = new Array(N_Layer)
  let biases: number[][] = new Array(N_Layer)
  let activations: Activation[][] = new Array(N_Layer)

  let N_Input_Node = spec.input_d

  for (let i_layer = 0; i_layer < N_Layer; i_layer++) {
    let N_Output_Node = layer_ds[i_layer]
    let activation: Activation[] = new Array(N_Output_Node)
    let bias: number[] = new Array(N_Output_Node)
    let weight: number[][] = new Array(N_Output_Node)
    biases[i_layer] = bias
    weights[i_layer] = weight
    activations[i_layer] = activation
    for (
      let i_output_node = 0;
      i_output_node < N_Output_Node;
      i_output_node++
    ) {
      let ws: number[] = new Array(N_Input_Node)
      activation[i_output_node] = randomActivation()
      bias[i_output_node] = randomValue()
      weight[i_output_node] = ws
      for (let i_input_node = 0; i_input_node < N_Input_Node; i_input_node++) {
        ws[i_input_node] = randomValue()
      }
    }
    N_Input_Node = N_Output_Node
  }

  return { weights, biases, activations }
}

export function randomValue() {
  let x = (random() * 15 + 1) / 10
  return random() < 0.5 ? x : -x
}

let output_pool: [number[], number[]] = [[], []]

export function runNetwork(network: Network, inputs: number[]): number[] {
  let N_Layer = network.weights.length
  for (let i_layer = 0; i_layer < N_Layer; i_layer++) {
    let weights = network.weights[i_layer]
    let biases = network.biases[i_layer]
    let activations = network.activations[i_layer]
    let N_Input_Node = weights[0].length
    let N_Output_Node = biases.length
    let outputs = output_pool[i_layer % 2]
    if (outputs.length < N_Output_Node) {
      outputs.length = N_Output_Node
    }
    for (
      let i_output_node = 0;
      i_output_node < N_Output_Node;
      i_output_node++
    ) {
      let weight = weights[i_output_node]
      let acc = biases[i_output_node]
      for (let i_input_node = 0; i_input_node < N_Input_Node; i_input_node++) {
        let w: number = weight[i_input_node]
        let x: number = inputs[i_input_node]
        let y: number = w * x
        acc += y
      }
      let activateFn = Activations[activations[i_output_node]]
      let output: number = activateFn(acc)
      outputs[i_output_node] = output
    }
    inputs = outputs
  }
  return inputs
}

export function randomActivation(): Activation {
  return floor(random() * N_Activation) + 1
}

export enum Activation {
  sigmoid = 1,
  tanh = 2,
  relu = 3,
  leaky_relu = 4,
}
let N_Activation = 4

let Activations = {
  [Activation.sigmoid]: sigmoid,
  [Activation.tanh]: tanh,
  [Activation.relu]: relu,
  [Activation.leaky_relu]: leaky_relu,
}

function sigmoid(x: number): number {
  return 1 / (1 + exp(-x))
}

function relu(x: number): number {
  return x > 0 ? x : 0
}

function leaky_relu(x: number): number {
  return x > 0 ? x : 0.01 * x
}
