import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit MenuItemReviews");
      expect(
        screen.queryByTestId("MenuItemReviews-itemId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 21,
          reviewEmail: "dqiao@ucsb.edu",
          stars: 5,
          dateReviewed: "2022-03-14T15:00:00.000",
          comments: "delicious",
        });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: "17",
        itemId: 22,
        reviewEmail: "phtcon@ucsb.edu",
        stars: 2,
        dateReviewed: "2022-03-15T16:02:20.200",
        comments: "middling",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewsForm-id");

      const idField = screen.getByTestId("MenuItemReviewsForm-id");
      const itemField = screen.getByTestId("MenuItemReviewsForm-itemId");
      const reviewerField = screen.getByTestId(
        "MenuItemReviewsForm-reviewEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
      const dateField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemField).toBeInTheDocument();
      expect(itemField).toHaveValue("21");
      expect(reviewerField).toBeInTheDocument();
      expect(reviewerField).toHaveValue("dqiao@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("5");
      expect(dateField).toBeInTheDocument();
      expect(dateField).toHaveValue("2022-03-14T15:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("delicious");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemField, {
        target: { value: 22 },
      });
      fireEvent.change(reviewerField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: 2 },
      });
      fireEvent.change(dateField, {
        target: { value: "2022-03-15T16:02" },
      });
      fireEvent.change(commentsField, {
        target: { value: "middling" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReviews Updated - id: 17 itemId: 22",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "22",
          reviewEmail: "phtcon@ucsb.edu",
          stars: "2",
          dateReviewed: "2022-03-15T16:02",
          comments: "middling",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewsForm-id");

      const idField = screen.getByTestId("MenuItemReviewsForm-id");
      const itemField = screen.getByTestId("MenuItemReviewsForm-itemId");
      const reviewerField = screen.getByTestId(
        "MenuItemReviewsForm-reviewEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
      const dateField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemField).toBeInTheDocument();
      expect(itemField).toHaveValue("21");
      expect(reviewerField).toBeInTheDocument();
      expect(reviewerField).toHaveValue("dqiao@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("5");
      expect(dateField).toBeInTheDocument();
      expect(dateField).toHaveValue("2022-03-14T15:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("delicious");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemField, {
        target: { value: 22 },
      });
      fireEvent.change(reviewerField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: 2 },
      });
      fireEvent.change(dateField, {
        target: { value: "2022-03-15T16:02:20.200" },
      });
      fireEvent.change(commentsField, {
        target: { value: "middling" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReviews Updated - id: 17 itemId: 22",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
  });
});

// import { fireEvent, render, waitFor, screen } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";
// import mockConsole from "jest-mock-console";

// const mockToast = jest.fn();
// jest.mock("react-toastify", () => {
//   const originalModule = jest.requireActual("react-toastify");
//   return {
//     __esModule: true,
//     ...originalModule,
//     toast: (x) => mockToast(x),
//   };
// });

// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => {
//   const originalModule = jest.requireActual("react-router-dom");
//   return {
//     __esModule: true,
//     ...originalModule,
//     useParams: () => ({
//       id: 17,
//     }),
//     Navigate: (x) => {
//       mockNavigate(x);
//       return null;
//     },
//   };
// });

// describe("MenuItemReviewsEditPage tests", () => {
//   describe("when the backend doesn't return data", () => {
//     const axiosMock = new AxiosMockAdapter(axios);

//     beforeEach(() => {
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock
//         .onGet("/api/menuitemreview", { params: { id: 17 } })
//         .timeout();
//     });

//     const queryClient = new QueryClient();
//     test("renders header but table is not present", async () => {
//       const restoreConsole = mockConsole();

//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <MenuItemReviewsEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );
//       await screen.findByText("Edit MenuItemReviews");
//       expect(
//         screen.queryByTestId("MenuItemReviews-name"),
//       ).not.toBeInTheDocument();
//       restoreConsole();
//     });
//   });

//   describe("tests where backend is working normally", () => {
//     const axiosMock = new AxiosMockAdapter(axios);

//     beforeEach(() => {
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock
//         .onGet("/api/menuitemreview", { params: { id: 17 } })
//         .reply(200, {
//             id: 17,
//             itemId: "4",
//             reviewEmail: "test@gmail.com",
//             stars: "4",
//             dateReviewed: "2024-11-03T12:00",
//             comments: "great",
//         });
//       axiosMock.onPut("/api/ucsbdiningcommonsmenuitems").reply(200, {
//         id: "17",
//         itemId: "5",
//         reviewEmail: "another@gmail.com",
//         stars: "6",
//         dateReviewed: "2024-11-03T12:01",
//         comments: "cool",
//       });
//     });

//     const queryClient = new QueryClient();
//     test("Is populated with the data provided", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <MenuItemReviewsEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByText("Edit MenuItemReviews");

//       const idField = screen.getByTestId("MenuItemReviewsForm-id");
//       const itemIdField = screen.getByTestId(
//         "MenuItemReviewsForm-itemId",
//       );
//       const reviewEmailField = screen.getByTestId(
//         "MenuItemReviewsForm-reviewEmail",
//       );
//       const starsField = screen.getByTestId(
//         "MenuItemReviewsForm-stars",
//       );
//       const dateReviewedField = screen.getByTestId(
//         "MenuItemReviewsForm-dateReviewed",
//       );
//       const submitButton = screen.getByTestId(
//         "MenuItemReviewsForm-submit",
//       );

//       expect(idField).toBeInTheDocument();
//       expect(idField).toHaveValue("17");
//       expect(itemIdField).toBeInTheDocument();
//       expect(itemIdField).toHaveValue("4");
//       expect(reviewEmailField).toBeInTheDocument();
//       expect(reviewEmailField).toHaveValue("test@gmail.com");
//       expect(submitButton).toBeInTheDocument();
//       expect(starsField).toHaveValue("4");

//       expect(submitButton).toBeInTheDocument();
//       expect(submitButton).toHaveTextContent("Update");

//       fireEvent.change(itemIdField, { target: { value: "5" } });
//       fireEvent.change(reviewEmailField, {
//         target: { value: "another@gmail.com" },
//       });
//       fireEvent.change(starsField, {
//         target: { value: "6" },
//       });
//       fireEvent.click(submitButton);

//       await waitFor(() => expect(mockToast).toBeCalled());
//       expect(mockToast).toBeCalledWith(
//         "MenuItemReviews Updated - id: 17 itemId: 5",
//       );
//       expect(mockNavigate).toBeCalledWith({
//         to: "/menuitemreviews",
//       });

//       expect(axiosMock.history.put.length).toBe(1);
//       expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
//       expect(axiosMock.history.put[0].data).toBe(
//         JSON.stringify({
//             id: "17",
//             itemId: "5",
//             reviewEmail: "another@gmail.com",
//             stars: "6",
//             dateReviewed: "2024-11-03T12:01",
//             comments: "cool",

//         }),
//       );
//     });

//     test("changes when you click update", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <MenuItemReviewsEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByText("Edit MenuItemReviews");

//       const idField = screen.getByTestId("MenuItemReviewsForm-id");
//       const itemIdField = screen.getByTestId(
//         "MenuItemReviewsForm-itemId",
//       );
//       const reviewEmailField = screen.getByTestId(
//         "MenuItemReviewsForm-reviewEmail",
//       );
//       const starsField = screen.getByTestId(
//         "MenuItemReviewsForm-stars",
//       );

//       const dateReviewedField = screen.getByTestId(
//         "MenuItemReviewsForm-dateReviewed",
//       );
//       const commentsField = screen.getByTestId(
//         "MenuItemReviewsForm-comments",
//       );
//       const submitButton = screen.getByTestId(
//         "MenuItemReviewsForm-submit",
//       );

//       expect(idField).toHaveValue("17");
//       expect(itemIdField).toHaveValue("4");
//       expect(reviewEmailField).toHaveValue("test@gmail.com");
//       expect(starsField).toHaveValue("4");
//       expect(dateReviewedField).toHaveValue("2024-11-03T12:00");
//       expect(commentsField).toHaveValue("great");
//       expect(submitButton).toBeInTheDocument();

//       fireEvent.change(itemIdField, { target: { value: "5" } });
//       fireEvent.change(reviewEmailField, {
//         target: { value: "another@gmail.com" },
//       });
//       fireEvent.change(starsField, {
//         target: { value: "6" },
//       });
//       fireEvent.change(dateReviewedField, {
//         target: { value: "2024-11-03T12:01" },
//       });
//       fireEvent.change(commentsField, {
//         target: { value: "cool" },
//       });
//       fireEvent.click(submitButton);

//       await waitFor(() => expect(mockToast).toBeCalledTimes(1));
//       expect(mockToast).toBeCalledWith(
//         "MenuItemReviews Updated - id: 17 itemId: 5",
//       );
//       expect(mockNavigate).toBeCalledWith({
//         to: "/menuitemreviews",
//       });

//       expect(axiosMock.history.put.length).toBe(1);
//     });
//   });
// });
