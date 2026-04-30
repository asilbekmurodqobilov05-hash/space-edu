export const creativityTopicsData = {
  1: {
    id: 1,
    title: 'Sayyora modullari',
    titleEn: 'Planet Modules',
    color: '#f472b6',
    lessons: [
      "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
    ].map(name => ({
      name,
      subLessons: [
        { name: `${name} Module Design`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
        { name: `${name} Landing Systems`, videoUrl: "https://www.youtube.com/embed/2HoTK_Gqi2Q" },
        { name: `${name} Habitat Construction`, videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" }
      ]
    }))
  },
  2: {
    id: 2,
    title: 'Raketalar va sun\'iy yo\'ldoshlar',
    titleEn: 'Rockets and Satellites',
    color: '#f472b6',
    lessons: [
      "Falcon 9", "Falcon Heavy", "Electron", "New Shepard", "Starship", "International Space Station", "Terra", "Aqua", "Envisat", "Gaia"
    ].map(name => ({
      name,
      subLessons: [
        { name: `${name} Engineering`, videoUrl: "https://www.youtube.com/embed/921VbEMAwwY" },
        { name: `${name} Operational Orbit`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
        { name: `${name} Future Upgrades`, videoUrl: "https://www.youtube.com/embed/XJSKezIdHJY" }
      ]
    }))
  }
};
