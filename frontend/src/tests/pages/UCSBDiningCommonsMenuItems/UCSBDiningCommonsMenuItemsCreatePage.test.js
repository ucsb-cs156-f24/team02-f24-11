import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";
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

describe("UCSBDiningCommonsMenuItemsCreatePage tests", () => {
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
          <UCSBDiningCommonsMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Create New UCSBDiningCommonsMenuItem"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsbdiningcommonsmenuitems", async () => {
    const queryClient = new QueryClient();
    const ucsbdiningcommonsmenuitem = {
      id: 1,
      name: "test name",
      diningCommonsCode: "test diningcommonscode",
      station: "test station",
    };

    axiosMock
      .onPost("/api/ucsbdiningcommonsmenuitems/post")
      .reply(200, ucsbdiningcommonsmenuitem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Create New UCSBDiningCommonsMenuItem"),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText("Name");
    const diningCommonsCodeInput = screen.getByLabelText("Dining Commons Code");
    const stationInput = screen.getByLabelText("Station");
    const createButton = screen.getByText("Create");
    expect(nameInput).toBeInTheDocument();
    expect(diningCommonsCodeInput).toBeInTheDocument();
    expect(stationInput).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();

    fireEvent.change(nameInput, {
      target: { value: ucsbdiningcommonsmenuitem.name },
    });
    fireEvent.change(diningCommonsCodeInput, {
      target: { value: ucsbdiningcommonsmenuitem.diningCommonsCode },
    });
    fireEvent.change(stationInput, {
      target: { value: ucsbdiningcommonsmenuitem.station },
    });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1);
    });
    expect(axiosMock.history.post[0].params).toEqual({
      name: ucsbdiningcommonsmenuitem.name,
      diningCommonsCode: ucsbdiningcommonsmenuitem.diningCommonsCode,
      station: ucsbdiningcommonsmenuitem.station,
    });

    expect(mockToast).toBeCalledWith(
      "New ucsbDiningCommonsMenuItem Created - id: 1 name: test name",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommonsmenuitems" });
  });
});
