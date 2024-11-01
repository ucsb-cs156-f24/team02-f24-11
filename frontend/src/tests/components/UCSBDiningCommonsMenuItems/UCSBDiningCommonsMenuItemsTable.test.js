import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
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

describe("UCSBDiningCommonsMenuItemsTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers, content and buttons for ordinary user", async () => {
    const currentUser = { ...currentUserFixtures.userOnly };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            ucsbdiningcommonsmenuitems={
              ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Dining Commons Code", "Name", "Station"];
    const expectedFields = ["id", "diningCommonsCode", "name", "station"];
    const testId = "UCSBDiningCommonsMenuItemsTable";

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

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected column headers, content and buttons for admin user", async () => {
    const currentUser = { ...currentUserFixtures.adminUser };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            ucsbdiningcommonsmenuitems={
              ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Dining Commons Code", "Name", "Station"];
    const expectedFields = ["id", "diningCommonsCode", "name", "station"];
    const testId = "UCSBDiningCommonsMenuItemsTable";

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

  test("Edit button navigates to the edit page", async () => {
    const currentUser = { ...currentUserFixtures.adminUser };

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            ucsbdiningcommonsmenuitems={
              ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/ucsbdiningcommonsmenuitems/edit/1",
      );
    });
  });

  test("Delete button makes a delete request", async () => {
    const currentUser = { ...currentUserFixtures.adminUser };

    //spy on console log
    jest.spyOn(console, "log").mockImplementation(() => {});

    const axiosMock = new AxiosMockAdapter(axios);

    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitems")
      .reply(200, { message: "UCSBDiningCommonsMenuItem 1 deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            ucsbdiningcommonsmenuitems={
              ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].params.id).toBe(1);

    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    expect(message["message"]).toMatch("UCSBDiningCommonsMenuItem 1 deleted");
  });
});
