let { exp, tanh, random } = Math

export type Network = {
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

  let N_Input_Node = spec.input_d

  for (let i_layer = 0; i_layer < N_Layer; i_layer++) {
    let N_Output_Node = layer_ds[i_layer]
    let bias: number[] = new Array(N_Output_Node)
    let weight: number[][] = new Array(N_Output_Node)
    biases[i_layer] = bias
    weights[i_layer] = weight
    for (
      let i_output_node = 0;
      i_output_node < N_Output_Node;
      i_output_node++
    ) {
      let ws: number[] = new Array(N_Input_Node)
      bias[i_output_node] = randomValue()
      weight[i_output_node] = ws
      for (let i_input_node = 0; i_input_node < N_Input_Node; i_input_node++) {
        ws[i_input_node] = randomValue()
      }
    }
    N_Input_Node = N_Output_Node
  }

  return { weights, biases }
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
      let output: number = tanh(acc)
      outputs[i_output_node] = output
    }
    inputs = outputs
  }
  return inputs
}

function sigmoid(x: number): number {
  return 1 / (1 + exp(-x))
}
