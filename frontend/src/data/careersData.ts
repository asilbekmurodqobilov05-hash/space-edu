export interface CareerPath {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  education: string[];
  skills: string[];
  story: {
    name: string;
    role: string;
    content: string;
  };
  icon: string;
}

export const careersData: CareerPath[] = [
  {
    id: 'space-engineer',
    title: 'Space Engineer',
    shortDesc: 'Design propulsion systems, structural integrity, and robotics.',
    description: 'Space Engineers are the builders of the cosmos. They design, construct, and test spacecraft, rovers, and habitats. They solve complex problems related to propulsion, life support systems, and structural integrity in extreme environments.',
    education: ['B.S. in Aerospace, Mechanical, or Electrical Engineering', 'M.S. in Space Systems Engineering'],
    skills: ['Physics', 'CAD Design', 'Thermodynamics', 'Robotics', 'Resource Management'],
    story: {
      name: 'Diana Trujillo',
      role: 'Flight Director, NASA JPL',
      content: 'Moving to the US with only $300, Diana worked cleaning houses to pay for her education. She became an aerospace engineer and led the engineering team for the robotic arm of the Perseverance Mars rover.'
    },
    icon: 'Rocket'
  },
  {
    id: 'astrobiologist',
    title: 'AstroBiologist',
    shortDesc: 'Study extraterrestrial life and closed-loop ecosystems.',
    description: 'Astrobiologists seek to understand the origins, evolution, and distribution of life in the universe. They study extremophiles on Earth, design closed-loop biospheres for space habitats, and analyze soil samples from other planets for signs of microbial life.',
    education: ['B.S. in Biology, Chemistry, or Environmental Science', 'Ph.D. in Astrobiology or Planetary Science'],
    skills: ['Microbiology', 'Chemistry', 'Ecosystem Design', 'Geology', 'Data Analysis'],
    story: {
      name: 'Dr. Lynn Rothschild',
      role: 'Astrobiologist, NASA Ames',
      content: 'Dr. Rothschild studies how life evolved on Earth to understand where it might exist elsewhere. Her work with synthetic biology aims to use organisms to build habitats on Mars.'
    },
    icon: 'Telescope'
  },
  {
    id: 'space-pilot',
    title: 'Space Pilot',
    shortDesc: 'Master orbital mechanics, navigation, and spacecraft operation.',
    description: 'Space Pilots are the commanders of spacecraft. They master orbital mechanics, navigate complex trajectories, and make split-second decisions during launch, docking, and landing procedures.',
    education: ['B.S. in STEM field', 'Military Aviation or Test Pilot School', 'Astronaut Training Program'],
    skills: ['Orbital Mechanics', 'Spatial Awareness', 'Quick Decision Making', 'Mathematics', 'Systems Operation'],
    story: {
      name: 'Victor Glover',
      role: 'NASA Astronaut, Pilot',
      content: 'Victor Glover was the pilot of the first operational flight of the SpaceX Crew Dragon to the ISS. His background as a Navy test pilot prepared him for the rigors of spaceflight.'
    },
    icon: 'Monitor'
  },
  {
    id: 'space-programmer',
    title: 'Space Programmer',
    shortDesc: 'Develop flight software, automation, and telemetry analysis.',
    description: 'Space Programmers write the code that keeps spacecraft flying. From autonomous rover navigation to life support automation and telemetry data analysis, their software must be flawless and resilient to cosmic radiation.',
    education: ['B.S. in Computer Science or Software Engineering', 'Experience with embedded systems'],
    skills: ['Logic & Algorithms', 'Python / C++', 'Data Structures', 'Automation', 'Machine Learning'],
    story: {
      name: 'Margaret Hamilton',
      role: 'Lead Software Engineer, Apollo Project',
      content: 'Margaret Hamilton led the team that developed the onboard flight software for the Apollo missions. Her robust code prevented an abort of the Apollo 11 moon landing.'
    },
    icon: 'Database'
  }
];

export const roadmapSteps = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'Learn the basics of space science and your chosen field.',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    desc: 'Complete simulations and basic projects.',
  },
  {
    id: 'specialist',
    title: 'Specialist',
    desc: 'Master specific skills and build complex models.',
  },
  {
    id: 'professional',
    title: 'Professional',
    desc: 'Ready for real-world challenges and advanced missions.',
  }
];

export const careerQuizQuestions = [
  {
    q: "What do you enjoy doing the most?",
    options: [
      { text: "Building things, taking them apart, and fixing them", career: "space-engineer" },
      { text: "Studying nature, biology, and how ecosystems work", career: "astrobiologist" },
      { text: "Flying simulators, driving, and quick action", career: "space-pilot" },
      { text: "Solving complex puzzles and writing code", career: "space-programmer" }
    ]
  },
  {
    q: "Which subject is your favorite?",
    options: [
      { text: "Physics & Mechanics", career: "space-engineer" },
      { text: "Biology & Chemistry", career: "astrobiologist" },
      { text: "Math & Geometry", career: "space-pilot" },
      { text: "Computer Science & Logic", career: "space-programmer" }
    ]
  },
  {
    q: "What kind of project sounds most exciting?",
    options: [
      { text: "Designing a new rocket engine", career: "space-engineer" },
      { text: "Creating a self-sustaining greenhouse for Mars", career: "astrobiologist" },
      { text: "Calculating the perfect trajectory to orbit Jupiter", career: "space-pilot" },
      { text: "Writing an AI to autonomously drive a lunar rover", career: "space-programmer" }
    ]
  }
];
