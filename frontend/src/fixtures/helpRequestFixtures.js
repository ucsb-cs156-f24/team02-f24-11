const helpRequestFixtures = {
  oneDate: {
    id: 1,
    requesterEmail: "monkey@ucsb.edu",
    teamId: "1234",
    requestTime: "2022-02-02T12:00:00",
    explanation: "The great orangatangs",
    solved: true,
  },
  threeDates: [
    {
      id: 1,
      requesterEmail: "monkey1@ucsb.edu",
      teamId: "12345",
      requestTime: "2022-01-02T12:00:00",
      explanation: "The orangatangs",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "monkey2@ucsb.edu",
      teamId: "123456",
      requestTime: "2022-01-03T12:00:00",
      explanation: "The orangatangs2",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "monkey3@ucsb.edu",
      teamId: "123457",
      requestTime: "2022-01-05T12:00:00",
      explanation: "The orangatangs3",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
