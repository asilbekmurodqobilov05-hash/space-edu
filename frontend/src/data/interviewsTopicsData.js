export const interviewsTopicsData = {
  1: {
    id: 1,
    title: 'Professorlar',
    titleEn: 'Professors', titleRu: 'Профессора',
    color: '#3b82f6',
    sections: [
      {
        name: "Astronomy",
        lessons: [
          "Neil deGrasse Tyson", "Kip Thorne", "Brian Cox", "Andrea Ghez", "Adam Riess", "Saul Perlmutter", "Roger Penrose"
        ].map(name => ({
          name,
          subLessons: [
            { name: `${name}'s Early Career`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
            { name: `${name}'s Greatest Discoveries`, videoUrl: "https://www.youtube.com/embed/2HoTK_Gqi2Q" },
            { name: `${name} on Future of Space`, videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" }
          ]
        }))
      },
      {
        name: "Physics",
        lessons: [
          "Edward Witten", "Juan Maldacena", "Lisa Randall", "David Gross", "Frank Wilczek", "Ashoke Sen", "Cumrun Vafa"
        ].map(name => ({
          name,
          subLessons: [
            { name: `${name}'s Research Focus`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
            { name: `${name}'s Theoretical Impact`, videoUrl: "https://www.youtube.com/embed/2HoTK_Gqi2Q" },
            { name: `In Conversation with ${name}`, videoUrl: "https://www.youtube.com/embed/0KBjnN7kUKo" }
          ]
        }))
      }
    ]
  },
  2: {
    id: 2,
    title: 'Kosmonavtlar',
    titleEn: 'Cosmonauts', titleRu: 'Космонавты',
    color: '#3b82f6',
    lessons: [
      "Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Valentina Tereshkova"
    ].map(name => ({
      name,
      subLessons: [
        { name: `${name}'s Training`, videoUrl: "https://www.youtube.com/embed/XJSKezIdHJY" },
        { name: `${name}'s Historic Mission`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
        { name: `Legacy of ${name}`, videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" }
      ]
    }))
  },
  3: {
    id: 3,
    title: 'Boshqa xodimlar',
    titleEn: 'Other Workers',
    color: '#3b82f6',
    lessons: [
      "Mission Control", "Rocket Engineers", "Space Suits Designers"
    ].map(name => ({
      name,
      subLessons: [
        { name: `Role of ${name}`, videoUrl: "https://www.youtube.com/embed/XJSKezIdHJY" },
        { name: `A Day in the Life: ${name}`, videoUrl: "https://www.youtube.com/embed/libKVRa01L8" },
        { name: `Challenges for ${name}`, videoUrl: "https://www.youtube.com/embed/HCDVN7DCzYE" }
      ]
    }))
  }
};
