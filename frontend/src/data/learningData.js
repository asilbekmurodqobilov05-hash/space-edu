export const learningData = [
  {
    id: 'level-1',
    levelNumber: 1,
    title: 'Mercury Mission',
    theme: 'Orbital Foundations',
    description: 'Begin your journey by understanding the fundamental laws that govern our universe.',
    units: [
      {
        id: 'mercury',
        title: 'Mission: Mercury',
        description: 'Explore the closest planet to the Sun and learn about extreme temperatures and solar radiation.',
        icon: 'Sun',
        lessons: [
          {
            id: 'lesson-1-sun',
            title: 'The Sun: Our Star',
            description: 'Learn about the massive, glowing sphere of hot gas that powers our solar system.',
            xpReward: 50,
            sections: [
              {
                id: 'sec-1-video',
                type: 'video',
                title: 'Introduction to the Sun',
                videoUrl: 'https://www.youtube.com/embed/2HoTK_Gqi2Q?si=Wp_yM922U7x-K2hB',
                content: ['Watch this short video from Khan Academy to understand the basics of our Sun.']
              },
              {
                id: 'sec-1-exp',
                type: 'explanation',
                title: 'What is the Sun?',
                content: [
                  'The Sun is a yellow dwarf star at the center of our solar system. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
                  'It radiates energy mainly as visible light, ultraviolet light, and infrared radiation. It is by far the most important source of energy for life on Earth.',
                  'Its diameter is about 1.39 million kilometers (864,000 miles), or 109 times that of Earth. Its mass is about 330,000 times that of Earth, accounting for about 99.86% of the total mass of the Solar System.'
                ]
              },
              {
                id: 'sec-1-examples',
                type: 'worked-example',
                title: 'Understanding Solar Scale',
                examples: [
                  {
                    problem: 'If Earth was the size of a cherry (1.3cm), how big would the Sun be?',
                    solution: 'Since the Sun is 109 times wider than Earth, it would be about 1.4 meters wide—roughly the size of a large exercise ball!'
                  },
                  {
                    problem: 'How long does it take for sunlight to reach Earth?',
                    solution: 'Light travels at 300,000 km/s. The Sun is 150 million km away. 150,000,000 / 300,000 = 500 seconds, or about 8 minutes and 20 seconds.'
                  }
                ]
              },
              {
                id: 'sec-1-prac',
                type: 'practice',
                title: 'Check Your Understanding',
                practiceExercises: [
                  {
                    id: 'prac-1',
                    question: 'What percentage of the solar system\'s mass does the Sun account for?',
                    options: ['50%', '75%', '99.86%', '10%'],
                    correctAnswerIndex: 2,
                    hint: 'The Sun is incredibly massive compared to everything else combined.',
                    difficulty: 'easy',
                    explanation: 'The Sun contains almost all the mass in our solar system, leaving only 0.14% for all the planets, moons, and asteroids combined.'
                  },
                  {
                    id: 'prac-2',
                    question: 'If you were standing on the Sun (hypothetically), how much stronger would gravity be compared to Earth?',
                    options: ['2 times', '10 times', '28 times', '100 times'],
                    correctAnswerIndex: 2,
                    hint: 'The Sun\'s massive size creates immense gravitational pull.',
                    difficulty: 'medium',
                    explanation: 'Surface gravity on the Sun is about 28 times that of Earth due to its enormous mass.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-2',
    levelNumber: 2,
    title: 'Venus Mission',
    theme: 'The Hostile Void',
    description: 'Understand the challenges of space exploration: extreme heat, pressure, and toxic atmospheres.',
    units: [
      {
        id: 'venus',
        title: 'Mission: Venus',
        description: 'Learn what makes Venus a dangerous environment for humans and machines.',
        icon: 'AlertTriangle',
        lessons: [
          {
            id: 'lesson-2-atmosphere',
            title: 'The Greenhouse Effect',
            description: 'Understanding Venus\'s runaway greenhouse effect.',
            xpReward: 80,
            sections: [
              {
                id: 'sec-2-1-exp',
                type: 'explanation',
                title: 'Venus Atmosphere',
                content: [
                  'Venus has a thick, toxic atmosphere filled with carbon dioxide and it is perpetually shrouded in thick, yellowish clouds of sulfuric acid that trap heat, causing a runaway greenhouse effect.',
                  'It is the hottest planet in our solar system, even though Mercury is closer to the Sun. Surface temperatures on Venus are about 900 degrees Fahrenheit (475 degrees Celsius) - hot enough to melt lead.'
                ]
              },
              {
                id: 'sec-2-1-prac',
                type: 'practice',
                title: 'Atmospheric Pressure',
                practiceExercises: [
                  {
                    id: 'prac-2-1',
                    question: 'How does the atmospheric pressure on Venus compare to Earth?',
                    options: ['It is about the same', 'It is 10 times greater', 'It is 90 times greater', 'It is 1000 times greater'],
                    correctAnswerIndex: 2,
                    hint: 'Imagine being 1 mile underwater on Earth.',
                    difficulty: 'medium',
                    explanation: 'The pressure on Venus\'s surface is about 90 times that of Earth, similar to the pressure you\'d feel a mile deep in Earth\'s ocean.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-3',
    levelNumber: 3,
    title: 'Earth Mission',
    theme: 'Home World',
    description: 'Study our home planet from orbit and understand orbital mechanics.',
    units: [
      {
        id: 'earth',
        title: 'Mission: Earth Orbit',
        description: 'Learn about satellites, orbital debris, and observing Earth from space.',
        icon: 'Globe',
        lessons: [
          {
            id: 'lesson-3-debris',
            title: 'Space Debris',
            description: 'The growing problem of orbital junk.',
            xpReward: 100,
            sections: [
              {
                id: 'sec-3-1-exp',
                type: 'explanation',
                title: 'What is Space Debris?',
                content: [
                  'Space debris encompasses both natural meteoroids and artificial orbital debris. Meteoroids are in orbit about the sun, while most artificial debris is in orbit about the Earth.',
                  'Orbital debris is any man-made object in orbit about the Earth which no longer serves a useful function. Such debris includes nonfunctional spacecraft, abandoned launch vehicle stages, mission-related debris and fragmentation debris.'
                ]
              },
              {
                id: 'sec-3-1-prac',
                type: 'practice',
                title: 'Debris Impact',
                practiceExercises: [
                  {
                    id: 'prac-3-1',
                    question: 'Why is even a small piece of paint dangerous in orbit?',
                    options: ['It is toxic', 'It travels at extremely high speeds', 'It blocks solar panels', 'It confuses navigation systems'],
                    correctAnswerIndex: 1,
                    hint: 'Think about kinetic energy (E = 1/2 mv^2). Velocity is squared.',
                    difficulty: 'medium',
                    explanation: 'In low Earth orbit, objects travel at about 17,500 mph (28,000 km/h). At these speeds, even a tiny fleck of paint can cause significant damage upon impact.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-4',
    levelNumber: 4,
    title: 'Mars Mission',
    theme: 'Frontier Operations',
    description: 'Simulate and plan complex missions to the Red Planet.',
    units: [
      {
        id: 'mars',
        title: 'Mission: Mars',
        description: 'Take charge of advanced simulations for landing on Mars.',
        icon: 'Rocket',
        lessons: [
          {
            id: 'lesson-4-launch',
            title: 'Orbital Insertion',
            description: 'Master the physics of launching a rocket into orbit.',
            xpReward: 150,
            sections: [
              {
                id: 'sec-4-1-sim',
                type: 'simulation',
                title: 'Rocket Launch Simulator',
                simulationId: 'rocket-launch',
                content: [
                  'Use the Space Lab simulator to launch a rocket. You must balance thrust, gravity, and aerodynamics to achieve a stable orbit.'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-5',
    levelNumber: 5,
    title: 'Jupiter Mission',
    theme: 'Gas Giants',
    description: 'Explore the largest planet in our solar system and its massive storms.',
    units: [
      {
        id: 'jupiter',
        title: 'Mission: Jupiter',
        description: 'Study the Great Red Spot and Jupiter\'s many moons.',
        icon: 'Globe',
        lessons: [
          {
            id: 'lesson-5-storms',
            title: 'Giant Storms',
            description: 'Understanding the atmospheric dynamics of gas giants.',
            xpReward: 200,
            sections: [
              {
                id: 'sec-5-1-exp',
                type: 'explanation',
                title: 'The Great Red Spot',
                content: [
                  'Jupiter\'s Great Red Spot is a giant, spinning storm in its atmosphere. It is like a hurricane on Earth, but it is much larger.',
                  'It is so big that Earth could fit inside it! The storm has been raging for at least 300 years.'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-6',
    levelNumber: 6,
    title: 'Saturn Mission',
    theme: 'Ringed Wonders',
    description: 'Investigate the spectacular ring system of Saturn.',
    units: [
      {
        id: 'saturn',
        title: 'Mission: Saturn',
        description: 'Learn about the composition and formation of planetary rings.',
        icon: 'Globe',
        lessons: [
          {
            id: 'lesson-6-rings',
            title: 'Planetary Rings',
            description: 'What are Saturn\'s rings made of?',
            xpReward: 250,
            sections: [
              {
                id: 'sec-6-1-exp',
                type: 'explanation',
                title: 'Ring Composition',
                content: [
                  'Saturn\'s rings are made of billions of small chunks of ice and rock coated with another material such as dust.',
                  'The ring particles range in size from tiny, dust-sized icy grains to a few chunks as big as mountains.'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-7',
    levelNumber: 7,
    title: 'Uranus Mission',
    theme: 'Ice Giants',
    description: 'Discover the tilted ice giant and its extreme seasons.',
    units: [
      {
        id: 'uranus',
        title: 'Mission: Uranus',
        description: 'Understand why Uranus rotates on its side.',
        icon: 'Globe',
        lessons: [
          {
            id: 'lesson-7-tilt',
            title: 'Axial Tilt',
            description: 'The extreme seasons of Uranus.',
            xpReward: 300,
            sections: [
              {
                id: 'sec-7-1-exp',
                type: 'explanation',
                title: 'A Sideways Planet',
                content: [
                  'Uranus is unique because it rotates on its side. Its axis of rotation is tilted 98 degrees relative to its orbital plane.',
                  'This means that for a quarter of its 84-Earth-year orbit, the sun shines directly over each pole, plunging the other half of the planet into a 21-year-long, dark winter.'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-8',
    levelNumber: 8,
    title: 'Neptune Mission',
    theme: 'The Outer Limits',
    description: 'Journey to the farthest planet from the Sun.',
    units: [
      {
        id: 'neptune',
        title: 'Mission: Neptune',
        description: 'Study the supersonic winds of the blue ice giant.',
        icon: 'Globe',
        lessons: [
          {
            id: 'lesson-8-winds',
            title: 'Supersonic Winds',
            description: 'The fastest winds in the solar system.',
            xpReward: 350,
            sections: [
              {
                id: 'sec-8-1-exp',
                type: 'explanation',
                title: 'Extreme Weather',
                content: [
                  'Neptune has the fastest winds in the solar system. Winds whip clouds of frozen methane across the planet at speeds of more than 1,200 miles per hour (2,000 kilometers per hour).',
                  'This is about nine times faster than winds on Earth.'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Helper functions to navigate the hierarchy
export const getUnitById = (unitId) => {
  for (const level of learningData) {
    const unit = level.units.find(u => u.id === unitId);
    if (unit) return unit;
  }
  return undefined;
};

export const getLessonById = (lessonId) => {
  for (const level of learningData) {
    for (const unit of level.units) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      if (lesson) return { lesson, unitId: unit.id, levelId: level.id };
    }
  }
  return undefined;
};

export const getNextLesson = (unitId, currentLessonId) => {
  const unit = getUnitById(unitId);
  if (!unit) return undefined;
  
  const currentIndex = unit.lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === unit.lessons.length - 1) return undefined;
  
  return unit.lessons[currentIndex + 1];
};
