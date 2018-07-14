export const normalize = (vector) => {
  return div(vector, length(vector))
}

export const length = ({ x, y }) => {
  return Math.sqrt(x * x + y * y)
}

export const div = ({ x, y }, scalar) => {
  return {x: x / scalar, y: y / scalar}
}

export const add = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  return {x: x1 + x2, y: y1 + y2}
}

export const sub = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  return {x: x1 - x2, y: y1 - y2}
}

export const scale = (vector, scalar) => {
  return prod(normalize(vector), scalar)
}

export const prod = ({x, y}, scalar) => {
  return {x: x * scalar, y: y * scalar}
}

export const radiusVector = (link, radius) => {
  return scale(sub(link.target, link.source), radius)
}
