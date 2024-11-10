import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Create New MenuItemReviews"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const menuitemreviews = {
      id: 1,
      itemId: "4",
      reviewEmail: "test@gmail.com",
      stars: "4",
      dateReviewed: "2024-11-03T12:00",
      comments: "great",
    };

    axiosMock
      .onPost("/api/menuitemreview/post")
      .reply(200, menuitemreviews);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Create New MenuItemReviews"),
      ).toBeInTheDocument();
    });

    
    
    
    const itemIDInput = screen.getByLabelText("Item ID");
    const revEmailInput = screen.getByLabelText("Reviewer Email");
    const starsInput = screen.getByLabelText("Stars");
    const dateInput = screen.getByLabelText("Date Reviewed (iso format)");
    const commentsInput = screen.getByLabelText("Comments");
    const createButton = screen.getByText("Create");

    expect(itemIDInput).toBeInTheDocument();
    expect(revEmailInput).toBeInTheDocument();
    expect(starsInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(commentsInput).toBeInTheDocument();

    fireEvent.change(itemIDInput, {
      target: { value: menuitemreviews.itemId },
    });
    fireEvent.change(revEmailInput, {
      target: { value: menuitemreviews.reviewEmail },
    });
    fireEvent.change(starsInput, {
      target: { value: menuitemreviews.stars },
    });
    fireEvent.change(dateInput, {
        target: { value: menuitemreviews.dateReviewed },
    });
    fireEvent.change(commentsInput, {
        target: { value: menuitemreviews.comments },
    });



    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1);
    });
    expect(axiosMock.history.post[0].params).toEqual({
     

      itemId: menuitemreviews.itemId,
      reviewEmail: menuitemreviews.reviewEmail,
      stars: menuitemreviews.stars,
      dateReviewed: menuitemreviews.dateReviewed,
      comments: menuitemreviews.comments,
    });

    expect(mockToast).toBeCalledWith(
      "New menuItemReviews Created - id: 1 itemId: 4",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
  });
});