import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  test("Renders without crashing", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Name/);
    await screen.findByText(/Dining Commons Code/);
    await screen.findByText(/Station/);
    await screen.findByText(/Create/);
    await screen.findByText(/Cancel/);
  });

  test("Renders correctly when passing in a ucsbDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={
            ucsbDiningCommonsMenuItemsFixtures.oneUcsbDiningCommonsMenuItem
          }
        />
      </Router>,
    );

    await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue(
      "1",
    );
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-station",
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, { target: { value: "asdf" } });
    fireEvent.change(nameField, {
      target: { value: "123456789012345678901234567890123" },
    });
    fireEvent.change(stationField, { target: { value: "asdf" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Name must be 30 characters or less/);
    expect(
      screen.getByText(/Name must be 30 characters or less/),
    ).toBeInTheDocument();
  });

  test("Correct Error messages on empty input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-station",
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, { target: { value: "" } });
    fireEvent.change(nameField, { target: { value: "" } });
    fireEvent.change(stationField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Dining Commons Code is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-station",
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, { target: { value: "asdf" } });
    fireEvent.change(nameField, { target: { value: "asdf" } });
    fireEvent.change(stationField, { target: { value: "asdf" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    const cancelButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-cancel",
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
