export function isRealNumber(x: number): boolean {
  return isFinite(x) && !isNaN(x)
}