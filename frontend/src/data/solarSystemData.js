// Orbital parameters for J2000
// a = semi-major axis in AU
// e = eccentricity
// i = inclination in deg
// N = longitude of ascending node in deg
// w = argument of periapsis in deg
// M0 = mean anomaly at J2000 in deg
// n = mean daily motion in deg/day
// axialTilt in deg
// radius in km (using real relative scale is impossible to view, so we will use a mixed scale in the viewer)
// mass in kg

export const texturesBaseUrl = "/textures/";
export const threejsTextures = "/textures/";

export const celestialBodies = [
  {
    id: "sun",
    name: "Sun",
    type: "star",
    radius: 696340, // km
    mass: "1.989 × 10^30",
    gravity: "274 m/s²",
    temperature: "5,500 °C",
    color: "#FDB813",
    emissive: "#ffaa00",
    texture: texturesBaseUrl + "sunmap.jpg",
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    radius: 2439.7,
    mass: "3.301 × 10^23",
    gravity: "3.7 m/s²",
    temperature: "167 °C (avg)",
    atmosphere: "Minimal",
    color: "#8c8c8c",
    axialTilt: 0.034,
    texture: texturesBaseUrl + "mercurymap.jpg",
    textureNormal: texturesBaseUrl + "mercurybump.jpg",
    orbit: { a: 0.387, e: 0.2056, i: 7.0, N: 48.3, w: 29.1, M0: 174.8, n: 4.0923 }
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    radius: 6051.8,
    mass: "4.867 × 10^24",
    gravity: "8.87 m/s²",
    temperature: "464 °C",
    atmosphere: "CO2, Nitrogen",
    color: "#e3bb76",
    axialTilt: 177.36,
    texture: texturesBaseUrl + "venusmap.jpg",
    textureNormal: texturesBaseUrl + "venusbump.jpg",
    orbit: { a: 0.723, e: 0.0068, i: 3.39, N: 76.7, w: 55.2, M0: 50.1, n: 1.6021 }
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    radius: 6371,
    mass: "5.972 × 10^24",
    gravity: "9.8 m/s²",
    temperature: "15 °C",
    atmosphere: "Nitrogen, Oxygen",
    color: "#2b82c9",
    axialTilt: 23.44,
    texture: threejsTextures + "earth_atmos_2048.jpg",
    textureClouds: threejsTextures + "earth_clouds_1024.png",
    textureSpecular: threejsTextures + "earth_specular_2048.jpg",
    textureNormal: threejsTextures + "earth_normal_2048.jpg",
    orbit: { a: 1.0, e: 0.0167, i: 0.0, N: -11.26, w: 114.2, M0: 358.6, n: 0.9856 }
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    radius: 3389.5,
    mass: "6.39 × 10^23",
    gravity: "3.71 m/s²",
    temperature: "-65 °C",
    atmosphere: "CO2",
    color: "#c1440e",
    axialTilt: 25.19,
    texture: texturesBaseUrl + "marsmap1k.jpg",
    textureNormal: texturesBaseUrl + "marsbump1k.jpg",
    orbit: { a: 1.524, e: 0.0934, i: 1.85, N: 49.6, w: 286.5, M0: 19.4, n: 0.5240 }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    radius: 69911,
    mass: "1.898 × 10^27",
    gravity: "24.79 m/s²",
    temperature: "-110 °C",
    atmosphere: "Hydrogen, Helium",
    color: "#d39c7e",
    axialTilt: 3.13,
    texture: texturesBaseUrl + "jupitermap.jpg",
    orbit: { a: 5.203, e: 0.0484, i: 1.30, N: 100.5, w: 273.9, M0: 20.0, n: 0.0831 }
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    radius: 58232,
    mass: "5.683 × 10^26",
    gravity: "10.44 m/s²",
    temperature: "-140 °C",
    atmosphere: "Hydrogen, Helium",
    color: "#ead6b8",
    axialTilt: 26.73,
    hasRings: true,
    ringInner: 74500, // km
    ringOuter: 140000,
    texture: texturesBaseUrl + "saturnmap.jpg",
    textureRing: texturesBaseUrl + "saturnringcolor.jpg",
    orbit: { a: 9.537, e: 0.0542, i: 2.49, N: 113.7, w: 339.4, M0: 317.0, n: 0.0335 }
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    radius: 25362,
    mass: "8.681 × 10^25",
    gravity: "8.69 m/s²",
    temperature: "-195 °C",
    atmosphere: "Hydrogen, Helium, Methane",
    color: "#4b70dd",
    axialTilt: 97.77,
    hasRings: true,
    ringInner: 38000,
    ringOuter: 51000,
    texture: texturesBaseUrl + "uranusmap.jpg",
    textureRing: texturesBaseUrl + "uranusringcolour.jpg",
    orbit: { a: 19.191, e: 0.0472, i: 0.77, N: 74.0, w: 96.7, M0: 142.6, n: 0.0117 }
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    radius: 24622,
    mass: "1.024 × 10^26",
    gravity: "11.15 m/s²",
    temperature: "-200 °C",
    atmosphere: "Hydrogen, Helium, Methane",
    color: "#274687",
    axialTilt: 28.32,
    texture: texturesBaseUrl + "neptunemap.jpg",
    orbit: { a: 30.069, e: 0.0086, i: 1.77, N: 131.8, w: 273.2, M0: 256.2, n: 0.0060 }
  },
  // Dwarf Planets
  {
    id: "pluto",
    name: "Pluto",
    type: "dwarf",
    radius: 1188.3,
    color: "#dda0dd",
    texture: texturesBaseUrl + "plutomap1k.jpg",
    textureNormal: texturesBaseUrl + "plutobump1k.jpg",
    orbit: { a: 39.482, e: 0.2488, i: 17.14, N: 110.3, w: 113.8, M0: 14.9, n: 0.0040 }
  },
  {
    id: "ceres",
    name: "Ceres",
    type: "dwarf",
    radius: 473,
    color: "#a9a9a9",
    orbit: { a: 2.769, e: 0.0760, i: 10.59, N: 80.3, w: 73.6, M0: 77.4, n: 0.2141 }
  },
  {
    id: "eris",
    name: "Eris",
    type: "dwarf",
    radius: 1163,
    color: "#d3d3d3",
    orbit: { a: 67.781, e: 0.4407, i: 44.04, N: 35.9, w: 151.6, M0: 205.0, n: 0.0018 }
  },
  {
    id: "haumea",
    name: "Haumea",
    type: "dwarf",
    radius: 816,
    color: "#e0e0e0",
    orbit: { a: 43.218, e: 0.1913, i: 28.19, N: 121.1, w: 239.5, M0: 213.5, n: 0.0035 }
  },
  {
    id: "makemake",
    name: "Makemake",
    type: "dwarf",
    radius: 715,
    color: "#d2b48c",
    orbit: { a: 45.715, e: 0.1559, i: 29.00, N: 79.6, w: 245.2, M0: 159.2, n: 0.0032 }
  }
];

export const moons = [
  { id: "moon", name: "Moon", parent: "earth", radius: 1737.4, color: "#aaaaaa", distance: 0.00257, speed: 13.176, texture: threejsTextures + "moon_1024.jpg" },
  { id: "phobos", name: "Phobos", parent: "mars", radius: 11.2, color: "#888888", distance: 0.00006, speed: 1128 },
  { id: "deimos", name: "Deimos", parent: "mars", radius: 6.2, color: "#999999", distance: 0.00016, speed: 285 },
  { id: "io", name: "Io", parent: "jupiter", radius: 1821.6, color: "#ffff00", distance: 0.00281, speed: 203 },
  { id: "europa", name: "Europa", parent: "jupiter", radius: 1560.8, color: "#dddddd", distance: 0.00448, speed: 101 },
  { id: "ganymede", name: "Ganymede", parent: "jupiter", radius: 2634.1, color: "#aaaaaa", distance: 0.00715, speed: 50 },
  { id: "callisto", name: "Callisto", parent: "jupiter", radius: 2410.3, color: "#888888", distance: 0.01258, speed: 21 },
  { id: "titan", name: "Titan", parent: "saturn", radius: 2574.7, color: "#ffcc00", distance: 0.00816, speed: 22 },
  { id: "enceladus", name: "Enceladus", parent: "saturn", radius: 252.1, color: "#ffffff", distance: 0.00159, speed: 262 },
  { id: "triton", name: "Triton", parent: "neptune", radius: 1353.4, color: "#ccdddd", distance: 0.00237, speed: -61 }
];
