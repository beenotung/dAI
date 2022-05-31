import { CompeteFn, evolve } from './ga'
import { Network } from './nn'

let { random, floor, max } = Math

function shuffle(pool: Network[]): void {
  let pool_size = pool.length
  for (let i = pool_size * 2; i >= 0; i--) {
    let a = floor(random() * pool_size)
    let b = floor(random() * pool_size)
    let tmp = pool[a]
    pool[a] = pool[b]
    pool[b] = tmp
  }
}

export function evolvePool(competeFn: CompeteFn, pool: Network[]): void {
  shuffle(pool)
  let pool_size = pool.length
  for (let i = 0; i + 1 < pool_size; i += 2) {
    evolve(competeFn, pool[i], pool[i + 1])
  }
}
