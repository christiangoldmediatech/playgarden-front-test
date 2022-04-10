import { PathItem, PathItemCoordinateValues, PathItemCoordinates } from '@/models'

type PathGenerationParms = {
  items: PathItem[]
  color: string
  lighterColor: string
}

export const pathWidth = 1051
export const pathHeight = 2484
export const pathYOffset = 255.8401

export const paths = [
  // 1st Segment
  {
    initialX: 900.999,
    initialY: 74.5401,
    d:
      'h-0.1c-13.78,-7.16,-36.5,-19.73,-71.64,-32.49c-57.26,-20.32,-117.77,-30.72,-167.66,-36.05c-32.6,-3.26,-69.06,-5.19,-109.78,-5.19l-127.71,254.19c16.3,-0.15,31.86,-0.31,46.74,-0.4c70.14,-1.21,175.09,-1.5,236.49,40.06c51.02,-69.91,119.34,-171.33,193.66,-220.12z'
  },
  // 2nd Segment
  {
    initialX: 1047.61,
    initialY: 420,
    d:
      'c12.73,-143.23,-22.33,-252.33,-110.32,-321.06c-11.517,-8.964,-23.643,-17.117,-36.29,-24.4c-74.29,48.79,-142.61,150.21,-193.58,220.14c34.94,23.65,55.77,60.85,48,119.15c90,30.63,187.21,52.86,280.08,73.08c6.099,-21.88,10.153,-44.28,12.11,-66.91v0z'
  },
  // 3rd Segment
  {
    initialX: 774.181,
    initialY: 736.46,
    d:
      'c4.17,-1.37,8.61,-2.89,13.26,-4.55c140.94,-52.25,218.71,-140.85,248,-245c-92.87,-20.22,-190,-42.45,-280.08,-73.08c-1.387,11.859,-5.058,23.337,-10.81,33.8c-36.49,66.56,-148.14,67.48,-203.33,74.45c27.84,40.16,203.22,175.17,232.96,214.38z'
  },
  // 4th Segment
  {
    initialX: 328.531,
    initialY: 842.14,
    d:
      'c42.05,-28.24,115.89,-53.42,244.6,-65c83.531,-7.5,154.591,-23.11,214.311,-45.25c-4.65,1.66,-9.091,3.18,-13.26,4.55c-29.741,-39.21,-205.121,-174.22,-232.931,-214.41c-99.719,12.58,-211.78,26.73,-306.69,64.44c49.81,75.1,120.201,167.7,158.071,225c-26.8,9.07,-47.77,19.53,-64.101,30.67z'
  },
  // 5th Segment
  {
    initialX: 277,
    initialY: 960.12,
    d:
      'c-0.33,-1.43,-0.61,-2.88,-0.84,-4.33c-1.755,-9.56,-2.302,-19.303,-1.63,-29c1.28,-24,11.14,-55.91,54,-84.68c16.33,-11.15,37.3,-21.6,64.1,-30.68c-37.87,-57.27,-108.26,-149.87,-158.07,-225c-7.293,2.9,-14.48,5.934,-21.56,9.1c-134.45,60.57,-208.34,169.35,-209.51,307.47c0,3.08,0.07,6.17,0.18,9.27c0.621,23.475,2.476,46.901,5.56,70.18c5.6,37.92,15.204,73.114,28.81,105.58c7.704,17.824,16.566,35.124,26.53,51.79c0.031,0.045,0.057,0.091,0.08,0.14c65.19,-57.74,144.8,-112.87,217.45,-160.83c-0.74,-3.13,-3.1,-9.85,-5.1,-19.01z'
  },
  // 6th Segment
  {
    initialX: 610.75,
    initialY: 1111.19,
    d:
      'c-152.56,-19.64,-316,-75.54,-333.71,-151.07c1.95,9.16,4.32,15.89,5.06,19.05c-72.65,48,-152.26,103.09,-217.45,160.83c30.38,49.333,71.91,90.647,124.59,123.94c56.34,35.47,146.87,60.26,231,77c61.86,-74.58,141.76,-146.88,204.58,-227.94c-5.25,-0.67,-9.97,-1.28,-14.07,-1.81z'
  },
  // 7th Segment
  {
    initialX: 1000.3,
    initialY: 1305.47,
    d:
      'c-17.838,-28.029,-39.929,-53.113,-65.48,-74.35c-16.94,-13.87,-36.55,-27.31,-60,-41.45c-44.27,-25.19,-91.44,-42.21,-134.31,-53.89c-26.07,-7,-50.54,-12.14,-71.19,-15.87c-17.16,-3.06,-32.27,-5.24,-44.46,-6.88c-62.85,81,-142.72,153.33,-204.58,227.86c31.37,6.23,61.86,11.33,89.35,15.44c14.49,2,29.08,4,43.58,6.07l7.07,0.9c96.35,12.15,156.26,34.38,184.7,61.78c0,0,0,0,0,0.05c25.75,-3.13,194.84,-108.59,255.32,-119.66z'
  },
  // 8th Segment
  {
    initialX: 744.999,
    initialY: 1425.13,
    d:
      'c0,0,0,0,0,-0.05c55.92,53.89,-9.83,127.83,-159.56,184.73c20.001,5.73,32.47,9.27,51.43,14c79.13,19.62,223.38,45,303.74,58.21c64.72,-51.4,102.93,-106.89,107,-166.5c6,-87.88,-13.45,-156.45,-47.25,-210c-60.54,11.02,-229.63,116.48,-255.36,119.61z'
  },
  // 9th Segment
  {
    initialX: 585.379,
    initialY: 1609.81,
    d:
      'c-18.786,7.133,-38.866,13.977,-60.24,20.53c-31.65,9.68,-71.16,20.76,-114,34.32c-24,7.73,-48.59,15.95,-73.38,24.9l-0.23,0.08c42.09,27.08,257.3,162.63,257.3,162.63c34.17,-10.84,141.17,-48.37,239.02,-101.19c40.79,-22.14,76.61,-45.15,106.7,-69.06c-80.36,-13.2,-224.61,-38.59,-303.74,-58.21c-18.96,-4.73,-31.39,-8.27,-51.43,-14z'
  },
  // 10th Segment
  {
    initialX: 337.501,
    initialY: 1689.64,
    d:
      'c-117.22,43,-240.38,106.62,-291.45,209.16c54.55,19.28,180.81,110.28,217.72,117.53c37.15,-73.62,155.93,-102.38,272.65,-143.29c114.85,-37.15,216,-77.8,297.43,-122c-97.85,52.86,-204.85,90.39,-239.05,101.23c0,0,-215.21,-135.55,-257.3,-162.63z'
  },
  // 11th Segment
  {
    initialX: 46.0495,
    initialY: 1898.8,
    d:
      'c-1.18,2.38,-2.33,4.79,-3.43,7.21c-55.18,143.11,-48.06,256.52,-25.47,332.88c9.564,31.896,23.893,62.164,42.5,89.78c3.862,5.302,8.182,10.254,12.91,14.8c3,1.11,185.8,-154.86,226.71,-180.37c-19.93,-14.57,-32.409,-31,-39.649,-47.77c-9.71,-21.89,-12,-48,-3.5,-79.24c1.894,-6.819,4.456,-13.434,7.649,-19.75c-36.909,-7.26,-163.169,-98.26,-217.72,-117.54z'
  },
  // 12th Segment
  {
    initialX: 299.27,
    initialY: 2163.1,
    d: 'c-40.91,25.51,-223.7,181.48,-226.71,180.37c-4.728,-4.546,-9.048,-9.498,-12.91,-14.8c65.76,96.94,194.9,157.61,367.05,155.51c0,0,116.06,-231.71,127.72,-254.14c-0.56,-1.15,-246.07,-4.85,-294.8,-114.71c7.24,16.78,19.72,33.2,39.65,47.77z'
  }
]

const svgns = 'http://www.w3.org/2000/svg'
function createPath() {
  return document.createElementNS(svgns, 'path')
}

export function generateSVGElement() {
  const activityPathSVG = document.createElementNS(svgns, 'svg')
  activityPathSVG.setAttribute('id', 'pathSVG')
  activityPathSVG.setAttribute('viewBox', `0 0 ${pathWidth} 1000000`)
  activityPathSVG.setAttribute('fill', 'none')
  activityPathSVG.setAttribute('xmlns', svgns)
  activityPathSVG.classList.add('pathSvg')

  return activityPathSVG
}

export function generatePath({ items, color, lighterColor }: PathGenerationParms) {
  const activityPathSVG = generateSVGElement()

  const group = document.createElementNS(svgns, 'g')
  group.setAttribute('id', 'pathGroup')

  for (let i = 0; i < items.length; i++) {
    const cycleLength = paths.length
    const cycle = Math.floor(i / cycleLength)
    const pathIndex = i - cycle * cycleLength
    const pathData = paths[pathIndex]
    const fillColor = pathIndex % 2 === 0 ? color : lighterColor
    const path = createPath()
    const adjustedY =
      cycle * pathHeight + pathData.initialY - cycle * pathYOffset

    path.setAttribute('d', `M${pathData.initialX},${adjustedY}${pathData.d}`)
    path.setAttribute('fill', fillColor)
    group.appendChild(path)
  }

  activityPathSVG.appendChild(group)

  return activityPathSVG
}

export function mountPath(containerId: string, activityPathSVG: SVGSVGElement): void {
  const container = document.getElementById(containerId)
  if (container) {
    // remove any old svg elements
    while (container.querySelector('.pathSvg')) {
      const oldSvg = container.querySelector('.pathSvg')
      if (oldSvg) {
        container.removeChild(oldSvg)
      }
    }
    container.appendChild(activityPathSVG)
  }

  const svg = document.getElementById('pathSVG')
  const pathGroup = (document.getElementById(
    'pathGroup'
  ) as unknown) as SVGGElement
  if (svg && pathGroup) {
    // Set resulting height
    const height = pathGroup.getBBox().height
    activityPathSVG.setAttribute('viewBox', `0 0 ${pathWidth} ${height}`)
  }
}

// Path item coordinates
const pathItemCoordinates: PathItemCoordinateValues[] = [
  { top: 2, left: 50 },
  { top: 17, left: 74 },
  { top: 43.5, left: 66 },
  { top: 51.75, left: 35 },
  { top: 68, left: 4 },
  { top: 100.5, left: 20 },
  { top: 109, left: 57 },
  { top: 133, left: 74 },
  { top: 153.5, left: 46 },
  { top: 163.75, left: 17 },
  { top: 190, left: 1.5 },
  { top: 210.5, left: 20 }
]

export function findPathItemCoordinates(index: number): PathItemCoordinates {
  const coordinates = {
    marginTop: '0',
    marginLeft: '0'
  }
  const cycleLength = paths.length
  const cycle = Math.floor(index / cycleLength)
  const pathItemIndex = index - cycle * cycleLength
  const heightOffset = 211.95 // TBD
  const foundCoordinates = pathItemCoordinates[pathItemIndex]

  if (foundCoordinates) {
    coordinates.marginTop = `${foundCoordinates.top + heightOffset * cycle}%`
    coordinates.marginLeft = `${foundCoordinates.left}%`
  }

  return coordinates
}

export function generatePathItemPlayIcon(fillColor: string): string {
  const playIconSvg = document.createElementNS(svgns, 'svg')
  playIconSvg.setAttribute('width', '29')
  playIconSvg.setAttribute('height', '31')
  playIconSvg.setAttribute('viewBox', '0 0 29 31')
  playIconSvg.setAttribute('xmlns', svgns)

  const outerCirclePath = createPath()
  outerCirclePath.setAttribute('d', 'M28.9775 15.2522C28.5354 7.26686 22.8473 -0.423816 14.8604 0.0181765C6.87345 0.460169 -0.789293 8.85803 0.0653978 16.8139C1.36217 28.7182 7.31553 30.9282 15.3025 30.4862C23.2894 30.0442 29.4196 23.2375 28.9775 15.2522Z')
  outerCirclePath.setAttribute('fill', fillColor)

  const playArrowPath = createPath()
  playArrowPath.setAttribute('d', 'M22.7902 15.2805C20.6682 14.1313 18.5168 12.9821 16.3653 11.9214C16.3064 11.4204 15.9822 10.949 15.3338 10.7722C13.2707 10.2418 9.32148 5.91026 9.6162 9.09261L9.64567 18.1977C9.73409 19.8478 9.82251 21.4979 9.76356 23.148C9.73409 24.1793 10.7951 25.0044 11.915 24.5624L23.2618 16.6065C23.9396 16.0466 23.3207 15.5457 22.7902 15.2805Z')
  playArrowPath.setAttribute('fill', 'white')

  playIconSvg.appendChild(outerCirclePath)
  playIconSvg.appendChild(playArrowPath)

  const serializer = new XMLSerializer()
  const serialized = serializer.serializeToString(playIconSvg)
  const imageSrc = `data:image/svg+xml;base64,${btoa(serialized)}`

  return imageSrc
}

// PathItemPopupLocations
export const pathItemPopupLocations = [
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'right',
    lg: 'right'
  },
  {
    xs: 'right',
    lg: 'right'
  },
  {
    xs: 'right',
    lg: 'right'
  },
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'left',
    lg: 'left'
  },
  {
    xs: 'right',
    lg: 'right'
  },
  {
    xs: 'right',
    lg: 'right'
  },
  {
    xs: 'right',
    lg: 'right'
  }
]
