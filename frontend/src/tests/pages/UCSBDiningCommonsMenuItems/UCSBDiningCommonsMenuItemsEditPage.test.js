import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

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

describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {
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
      axiosMock
        .onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItem-name"),
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
        .onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          name: "test name",
          diningCommonsCode: "test diningcommonscode",
          station: "test station",
        });
      axiosMock.onPut("/api/ucsbdiningcommonsmenuitems").reply(200, {
        id: "17",
        name: "different name",
        diningCommonsCode: "different diningcommonscode",
        station: "different station",
      });
    });

    const queryClient = new QueryClient();
    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit UCSBDiningCommonsMenuItem");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("test name");
      expect(diningCommonsCodeField).toBeInTheDocument();
      expect(diningCommonsCodeField).toHaveValue("test diningcommonscode");
      expect(stationField).toBeInTheDocument();
      expect(stationField).toHaveValue("test station");

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(nameField, { target: { value: "different name" } });
      fireEvent.change(diningCommonsCodeField, {
        target: { value: "different diningcommonscode" },
      });
      fireEvent.change(stationField, {
        target: { value: "different station" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem Updated - id: 17 name: different name",
      );
      expect(mockNavigate).toBeCalledWith({
        to: "/ucsbdiningcommonsmenuitems",
      });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "different name",
          diningCommonsCode: "different diningcommonscode",
          station: "different station",
        }),
      );
    });

    test("changes when you click update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit UCSBDiningCommonsMenuItem");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(nameField).toHaveValue("test name");
      expect(diningCommonsCodeField).toHaveValue("test diningcommonscode");
      expect(stationField).toHaveValue("test station");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(nameField, { target: { value: "different name" } });
      fireEvent.change(diningCommonsCodeField, {
        target: { value: "different diningcommonscode" },
      });
      fireEvent.change(stationField, {
        target: { value: "different station" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalledTimes(1));
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem Updated - id: 17 name: different name",
      );
      expect(mockNavigate).toBeCalledWith({
        to: "/ucsbdiningcommonsmenuitems",
      });

      expect(axiosMock.history.put.length).toBe(1);
    });
  });
});
