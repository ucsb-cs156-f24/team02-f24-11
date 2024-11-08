import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/UCSBOrganizationUtils";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("UCSBOrganizationUtils tests", () => {
  describe("onDeleteSuccess", () => {
    test("calls toast with the correct message", () => {
      // Arrange
      const message = "Organization deleted successfully";

      // Act
      onDeleteSuccess(message);

      // Assert
      expect(toast).toHaveBeenCalledWith(message);
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("returns the correct axios params object", () => {
      // Arrange
      const cell = { row: { values: { orgCode: "SKY" } } };

      // Act
      const result = cellToAxiosParamsDelete(cell);

      // Assert
      expect(result).toEqual({
        url: "/api/organizations",
        method: "DELETE",
        params: { id: "SKY" },
      });
    });
  });
});
