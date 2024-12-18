import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemsIndexPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
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

describe("UCSBDiningCommonsMenuItemsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UCSBDiningCommonsMenuItemsTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("renders without crashing for admin user", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").reply(200, []);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Create UCSBDiningCommonsMenuItem"),
      ).toBeInTheDocument();
    });

    const button = screen.getByText("Create UCSBDiningCommonsMenuItem");
    expect(button).toHaveAttribute(
      "href",
      "/ucsbdiningcommonsmenuitems/create",
    );
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders without crashing for user only", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitems/all")
      .reply(
        200,
        ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
      );
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-2-col-id`),
      ).toHaveTextContent("3");
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );

    expect(
      screen.queryByText("Create UCSBDiningCommonsMenuItem"),
    ).not.toBeInTheDocument();
  });

  test("renders two dates correctly for regular user", async () => {
    // arrange
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").timeout();
    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/ucsbdiningcommonsmenuitems/all",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
  });

  test("what happens when you click delete, admin", async () => {
    // arrange
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitems/all")
      .reply(
        200,
        ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
      );
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitems")
      .reply(200, "UCSBDiningCommonsMenuItem with id 1 was deleted");

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem with id 1 was deleted",
      );
    });
  });
});
