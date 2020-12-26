
/**
 * @param {any} o 
 * @returns {number}
 */
export function len(o) {
  if (o && o.length) {
    return o.length
  }
  return 0;
}
