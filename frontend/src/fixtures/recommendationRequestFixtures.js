const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: 'test@gmail.com',
    professorEmail: 'sample@gmail.com',
    explanation: 'test explanation',
    dateRequested: '2024-11-03T12:00:00',
    dateNeeded: '2024-12-03T12:00:00',
    done: false,
  },

  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: 'test1@gmail.com',
      professorEmail: 'sample1@gmail.com',
      explanation: 'test explanation1',
      dateRequested: '2024-11-03T12:00:00',
      dateNeeded: '2024-12-03T12:00:00',
      done: false,
    },
    {
      id: 2,
      requesterEmail: 'test2@gmail.com',
      professorEmail: 'sample2@gmail.com',
      explanation: 'test explanation2',
      dateRequested: '2024-11-04T12:00:00',
      dateNeeded: '2024-12-04T12:00:00',
      done: true,
    },
    {
      id: 3,
      requesterEmail: 'test3@gmail.com',
      professorEmail: 'sample3@gmail.com',
      explanation: 'test explanation3',
      dateRequested: '2024-11-05T12:00:00',
      dateNeeded: '2024-12-05T12:00:00',
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
