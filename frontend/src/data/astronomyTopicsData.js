export const astronomyTopicsData = {
  1: {
    id: 1,
    title: 'Quyosh tizimi',
    titleEn: 'Solar System', titleRu: 'Солнечная система',
    color: '#fbbf24',
    lessons: [
      { 
        name: "Sun", 
        subLessons: [
          { name: "Structure of the Sun", videoUrl: "https://www.youtube.com/embed/2HoTK_Gqi2Q" },
          { name: "Solar Energy & Fusion", videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" },
          { name: "The Sun's Life Cycle", videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" }
        ]
      },
      { 
        name: "Mercury", 
        subLessons: [
          { name: "Mercury's Extreme Environment", videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
          { name: "Geology of the Smallest Planet", videoUrl: "https://www.youtube.com/embed/XycHvvnc2X4" },
          { name: "Missions to Mercury", videoUrl: "https://www.youtube.com/embed/epZdZaEQhS0" }
        ]
      },
      { 
        name: "Venus", 
        subLessons: [
          { name: "The Runaway Greenhouse Effect", videoUrl: "https://www.youtube.com/embed/BvKaWlyf57w" },
          { name: "Venusian Surface & Volcanism", videoUrl: "https://www.youtube.com/embed/m4NXbFOiOGk" },
          { name: "Exploration of the Morning Star", videoUrl: "https://www.youtube.com/embed/D85gxYG9qhM" }
        ]
      },
      { 
        name: "Earth", 
        subLessons: [
          { name: "The Goldilocks Zone", videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" },
          { name: "Atmosphere & Biosphere", videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
          { name: "Earth's Magnetic Shield", videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" }
        ]
      },
      { 
        name: "Mars", 
        subLessons: [
          { name: "The Red Planet's History", videoUrl: "https://www.youtube.com/embed/D85gxYG9qhM" },
          { name: "Water on Mars", videoUrl: "https://www.youtube.com/embed/XycHvvnc2X4" },
          { name: "Future Human Colonization", videoUrl: "https://www.youtube.com/embed/921VbEMAwwY" }
        ]
      },
      { 
        name: "Jupiter", 
        subLessons: [
          { name: "The King of Planets", videoUrl: "https://www.youtube.com/embed/XycHvvnc2X4" },
          { name: "The Great Red Spot", videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
          { name: "Jupiter's Galilean Moons", videoUrl: "https://www.youtube.com/embed/epZdZaEQhS0" }
        ]
      },
      { 
        name: "Saturn", 
        subLessons: [
          { name: "Lord of the Rings", videoUrl: "https://www.youtube.com/embed/epZdZaEQhS0" },
          { name: "Saturn's Hexagon Storm", videoUrl: "https://www.youtube.com/embed/m4NXbFOiOGk" },
          { name: "Titan: A World with Liquid Lakes", videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" }
        ]
      },
      { 
        name: "Uranus", 
        subLessons: [
          { name: "The Sideways Ice Giant", videoUrl: "https://www.youtube.com/embed/m4NXbFOiOGk" },
          { name: "Atmosphere & Composition", videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
          { name: "Uranus's Ring System", videoUrl: "https://www.youtube.com/embed/epZdZaEQhS0" }
        ]
      },
      { 
        name: "Neptune", 
        subLessons: [
          { name: "The Windy Blue Planet", videoUrl: "https://www.youtube.com/embed/NStn7zZKXfE" },
          { name: "Triton: A Captured Moon", videoUrl: "https://www.youtube.com/embed/XycHvvnc2X4" },
          { name: "Neptune's Dark Spots", videoUrl: "https://www.youtube.com/embed/D85gxYG9qhM" }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: 'Yulduzlar',
    titleEn: 'Stars', titleRu: 'Звезды',
    color: '#fbbf24',
    lessons: [
      "O", "B", "A", "F", "G", "K", "M"
    ].map(type => ({
      name: type,
      subLessons: [
        { name: `${type}-Type Characteristics`, videoUrl: "https://www.youtube.com/embed/2HoTK_Gqi2Q" },
        { name: `Evolution of ${type} Stars`, videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" },
        { name: `Famous ${type}-Type Stars`, videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" }
      ]
    }))
  },
  3: {
    id: 3,
    title: 'Sun\'iy yo\'ldoshlar va raketalar',
    titleEn: 'Satellites and Rockets', titleRu: 'Искусственные спутники и ракеты',
    color: '#fbbf24',
    lessons: [
      { name: "Falcon 9", type: "rocket" },
      { name: "Falcon Heavy", type: "rocket" },
      { name: "Electron", type: "rocket" },
      { name: "New Shepard", type: "rocket" },
      { name: "Starship", type: "rocket" },
      { name: "International Space Station", type: "satellite" },
      { name: "Terra", type: "satellite" },
      { name: "Aqua", type: "satellite" },
      { name: "Envisat", type: "satellite" },
      { name: "Gaia", type: "satellite" }
    ].map(item => ({
      ...item,
      subLessons: [
        { name: `${item.name} Design`, videoUrl: "https://www.youtube.com/embed/921VbEMAwwY" },
        { name: `${item.name} Launch History`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
        { name: `${item.name} Mission Impact`, videoUrl: "https://www.youtube.com/embed/XJSKezIdHJY" }
      ]
    }))
  },
  4: {
    id: 4,
    title: 'Osmon jismlari',
    titleEn: 'Celestial Bodies',
    color: '#fbbf24',
    lessons: [
      "Planets", "Natural satellites", "Asteroids", "Comets", "Meteoroids", "Meteors", "Meteorites", "Galaxies", "Black holes", "Nebulae", "Quasars", "Pulsars", "Supernovae", "Exoplanets", "Galaxy clusters", "Cosmic dust and gas clouds"
    ].map(body => ({
      name: body,
      subLessons: [
        { name: `Understanding ${body}`, videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" },
        { name: `Physics of ${body}`, videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" },
        { name: `Observations of ${body}`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" }
      ]
    }))
  }
};
