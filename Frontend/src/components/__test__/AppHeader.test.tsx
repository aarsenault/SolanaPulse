import { render, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import AppHeader from "../AppHeader";

describe("AppHeader Component", () => {
  it("calls the color scheme change handler when ActionIcon is clicked", () => {
    const mockColorSchemeChange = jest.fn();
    const { getByLabelText } = render(
      <MantineProvider>
        <AppHeader onColorSchemeChange={mockColorSchemeChange} />
      </MantineProvider>
    );

    const colorSchemeIcon = getByLabelText(/Toggle color scheme/i);

    fireEvent.click(colorSchemeIcon);
    expect(mockColorSchemeChange).toHaveBeenCalledTimes(1);
  });
});
