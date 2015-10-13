// A modulo function that works for negative numbers
export function mod (dividend, divisor) {
  return ((dividend % divisor) + divisor) % divisor;
}

export function gcd (a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
