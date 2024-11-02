const mockToast = jest.fn();

jest.mock("react-toastify", () => {
  return {
    toast: () => mockToast,
  };
});

describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {
  // since we have stubs, im putting a placeholder test here
  test("placeholder", () => {
    expect(1).toBe(1);
  });
});
