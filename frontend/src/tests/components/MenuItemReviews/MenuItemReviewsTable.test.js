import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const expectedFields = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const testId = "MenuItemReviewsTable";

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).toBeInTheDocument();
    });
  });

  test("renders table with correct column accessors and data", () => {
    const currentUser = currentUserFixtures.adminUser;
    const reviews = menuItemReviewsFixtures.threeReview;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      { header: "id", accessor: "id" },
      { header: "itemId", accessor: "itemId" },
      { header: "reviewEmail", accessor: "reviewEmail" },
      { header: "stars", accessor: "stars" },
      { header: "dateReviewed", accessor: "dateReviewed" },
      { header: "comments", accessor: "comments" },
    ];

    expectedHeaders.forEach(({ header, accessor }) => {
      // Check for header presence
      const headerElement = screen.getByText(header);
      expect(headerElement).toBeInTheDocument();

      // Check that the data in each column matches the expected accessor value
      const cellElement = screen.getByTestId(
        `MenuItemReviewsTable-cell-row-0-col-${accessor}`,
      );
      expect(cellElement).toHaveTextContent(reviews[0][accessor]);
    });
  });

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const expectedFields = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const testId = "MenuItemReviewsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    // expect(
    //   screen.getByTestId(`${testId}-cell-row-0-col-Done`),
    // ).toHaveTextContent("false");

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const expectedFields = [
      "id",
      "itemId",
      "reviewEmail",
      "stars",
      "dateReviewed",
      "comments",
    ];
    const testId = "MenuItemReviewsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    // expect(
    //   screen.getByTestId(`${testId}-cell-row-0-col-Done`),
    // ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`MenuItemReviewsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `MenuItemReviewsTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/menuitemreviews/edit/1"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsTable
            review={menuItemReviewsFixtures.threeReview}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/menuitemreview")
      .reply(200, { message: "Menu Item Review deleted" });

    // act - render the component

    // assert - check that the expected content is rendered

    await waitFor(() => {
      expect(
        screen.getByTestId(`MenuItemReviewsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `MenuItemReviewsTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
