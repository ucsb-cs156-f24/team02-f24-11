import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { BrowserRouter as Router } from "react-router-dom";
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));
describe("MenuItemReviewsForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewsForm />
      </Router>,
    );
    await screen.findByText(/Item ID/);
    await screen.findByText(/Reviewer Email/);
    await screen.findByText(/Stars/);
    await screen.findByText(/Date Reviewed/);
    await screen.findByText(/Comments/);
    await screen.findByText(/Create/);
    await screen.findByText(/Cancel/);
  });
  test("renders correctly when passing in a MenuItemReviews", async () => {
    render(
      <Router>
        <MenuItemReviewsForm
          initialContents={menuItemReviewsFixtures.oneReview}
        />
      </Router>,
    );
    await screen.findByTestId(/MenuItemReviewsForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewsForm-id/)).toHaveValue("1");
  });
  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewsForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewsForm-submit");
    const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
    const reviewEmailField = screen.getByTestId(
      "MenuItemReviewsForm-reviewEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
    const dataReviewedField = screen.getByTestId(
      "MenuItemReviewsForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
    //const doneField = screen.getByTestId("MenuItemReviewsForm-done");
    const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");
    fireEvent.change(itemIdField, { target: { value: "bad-input" } });
    fireEvent.change(reviewEmailField, { target: { value: "bad-input" } });
    fireEvent.change(starsField, { target: { value: "bad-input" } });
    fireEvent.change(dataReviewedField, { target: { value: "bad-input" } });
    fireEvent.change(commentsField, { target: { value: "bad-input" } });
    //fireEvent.change(doneField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Date Reviewed is required./);
  });
  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewsForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewsForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");
    fireEvent.click(submitButton);
    await screen.findByText(/Item ID is required./);
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
  });
  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();
    render(
      <Router>
        <MenuItemReviewsForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewsForm-itemId");
    const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
    const reviewEmailField = screen.getByTestId(
      "MenuItemReviewsForm-reviewEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewsForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
    //const doneField = screen.getByTestId("MenuItemReviewsForm-done");
    const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");
    fireEvent.change(itemIdField, {
      target: { value: "4" },
    });
    fireEvent.change(reviewEmailField, {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(starsField, {
      target: { value: "4" },
    });
    fireEvent.change(dateReviewedField, {
      target: { value: "2024-11-03T12:00:00" },
    });
    fireEvent.change(commentsField, {
      target: { value: "great" },
    });
    // fireEvent.change(doneField, { target: { value: "true" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    expect(screen.queryByText(/Item ID is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Reviewer Email is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Reviewed is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();
  });
  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewsForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewsForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewsForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
