import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

const currentYear = new Date().getFullYear();

const renderFooter = () => {
  render(<Footer/>);
}

describe("Footer tests", () => {
  it("Render footer correctly", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeVisible();
    expect(footer).toHaveTextContent(`${currentYear}`);
  });
});
