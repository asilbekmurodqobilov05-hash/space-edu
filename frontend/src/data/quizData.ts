export const quizData = {
  beginner: [
    { id: 'b1', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
    { id: 'b2', question: 'What is the closest star to Earth?', options: ['Sirius', 'Alpha Centauri', 'The Sun', 'Betelgeuse'], correct: 2 },
    { id: 'b3', question: 'Which planet is the largest in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correct: 2 },
    { id: 'b4', question: 'What do we call a rock from space that hits the Earth\'s surface?', options: ['Meteor', 'Meteorite', 'Asteroid', 'Comet'], correct: 1 },
    { id: 'b5', question: 'How many moons does Earth have?', options: ['0', '1', '2', '3'], correct: 1 },
  ],
  intermediate: [
    { id: 'i1', question: 'What is the name of the galaxy we live in?', options: ['Andromeda', 'Triangulum', 'Milky Way', 'Sombrero'], correct: 2 },
    { id: 'i2', question: 'Which planet rotates on its side?', options: ['Uranus', 'Neptune', 'Saturn', 'Venus'], correct: 0 },
    { id: 'i3', question: 'What is the hottest planet in our solar system?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correct: 1 },
    { id: 'i4', question: 'What is the Great Red Spot on Jupiter?', options: ['A volcano', 'A crater', 'A giant storm', 'A lake'], correct: 2 },
    { id: 'i5', question: 'Who was the first human to travel into space?', options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], correct: 2 },
  ],
  advanced: [
    { id: 'a1', question: 'What is the approximate age of the Universe?', options: ['4.5 billion years', '13.8 billion years', '93 billion years', '1 trillion years'], correct: 1 },
    { id: 'a2', question: 'What is the boundary around a black hole beyond which no light can escape?', options: ['Event Horizon', 'Singularity', 'Accretion Disk', 'Photon Sphere'], correct: 0 },
    { id: 'a3', question: 'Which moon in the solar system has a dense atmosphere?', options: ['Europa', 'Ganymede', 'Titan', 'Triton'], correct: 2 },
    { id: 'a4', question: 'What is the primary process that powers the Sun?', options: ['Nuclear Fission', 'Nuclear Fusion', 'Chemical Combustion', 'Gravitational Contraction'], correct: 1 },
    { id: 'a5', question: 'What is the name of the hypothetical matter that makes up about 27% of the universe?', options: ['Antimatter', 'Dark Energy', 'Dark Matter', 'Strange Matter'], correct: 2 },
  ]
};

export const generateDailyChallenge = () => {
  return [
    quizData.beginner[0],
    quizData.beginner[1],
    quizData.intermediate[0],
    quizData.intermediate[1],
    quizData.advanced[0],
  ];
};
