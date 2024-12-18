import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByText(/requesterEmail/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneDate} />
      </Router>,
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/requesterEmail/)).toBeInTheDocument(); // changed
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(requestTimeField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/requestTime is required/);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/RequesterEmail is required./);
    await screen.findByText(/teamId is required./);
    await screen.findByText(/tableOrBreakoutRoom is required./);
    await screen.findByText(/explanation is required./);
    // await screen.findByText(/solved is required./);
    // expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/requestTime is required/)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requesterEmail");

    const RequesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    // const nameField = screen.getByTestId("HelpRequestForm-name");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");

    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );

    const explanationField = screen.getByTestId("HelpRequestForm-explanation");

    const solvedField = screen.getByTestId("HelpRequestForm-solved");

    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(RequesterEmailField, { target: { value: "20221" } });
    fireEvent.change(teamIdField, { target: { value: "12345" } });

    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "Table" } });
    fireEvent.change(explanationField, { target: { value: "Monkeys" } });

    fireEvent.change(solvedField, { target: { value: "True" } });

    // fireEvent.change(nameField, { target: { value: "noon on January 2nd" } });
    fireEvent.change(requestTimeField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // expect(
    //   screen.queryByText(/RequesterEmail must be in the format YYYYQ/),
    // ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/requestTime must be in ISO format/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
