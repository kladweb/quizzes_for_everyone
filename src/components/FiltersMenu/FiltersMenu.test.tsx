import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { FiltersMenu, IFiltersMenu } from "./FiltersMenu";
import { CAT_LABELS_RU_EXT } from "../../variables/quizData";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {...actual, useNavigate: () => mockNavigate};
});

const renderWithRouter = (props: Partial<IFiltersMenu> = {}) => {
  const defaultProps: IFiltersMenu = {
    category: "all",
    uniqueCategories: ["all", "russian", "math", "english"],
    pageQuizzes: "allquizzes",
  };
  return render(
    <BrowserRouter>
      <FiltersMenu {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe("FiltersMenu", () => {

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders selected category from props", () => {
    renderWithRouter({category: "math"});
    expect(screen.getByRole("combobox")).toHaveValue("math");
  });

  it("uses 'all' when category prop is undefined", () => {
    renderWithRouter({category: undefined});
    expect(screen.getByRole("combobox")).toHaveValue("all");
  });

  it("displays correct labels for categories", () => {
    const uniqueCategories = ["russian", "math", "english"];
    renderWithRouter({uniqueCategories});
    expect(screen.getByText(CAT_LABELS_RU_EXT.russian)).toBeInTheDocument();
    expect(screen.getByText(CAT_LABELS_RU_EXT.math)).toBeInTheDocument();
    expect(screen.getByText(CAT_LABELS_RU_EXT.english)).toBeInTheDocument();
  });

  it("renders all category options", () => {
    const uniqueCategories = ["russian", "math", "english"];
    renderWithRouter({uniqueCategories});
    expect(screen.getAllByRole("option")).toHaveLength(uniqueCategories.length);
  });

  it("navigates to '/allquizzes/russian' when selecting a specific category on allquizzes page", async () => {
    const user = userEvent.setup();
    renderWithRouter({pageQuizzes: "allquizzes"});
    await user.selectOptions(screen.getByRole("combobox"), "russian");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/allquizzes/russian");
  });

  it("handles empty uniqueCategories array", () => {
    renderWithRouter({uniqueCategories: []});
    const options = screen.queryAllByRole("option");
    expect(options).toHaveLength(0);
  });

  it("falls back to category key when translation is missing", () => {
    renderWithRouter({uniqueCategories: ["all", "unknown_category"]});
    expect(screen.getByRole("option", {name: "unknown_category"})).toBeInTheDocument();
  });

  it("navigates to '/allquizzes' when all selected", async () => {
    const user = userEvent.setup();
    renderWithRouter({category: "math"});
    await user.selectOptions(screen.getByRole("combobox"), "all");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/allquizzes");
  });

  it("navigates to myquizzes category page", async () => {
    const user = userEvent.setup();
    renderWithRouter({pageQuizzes: "myquizzes"});
    await user.selectOptions(screen.getByRole("combobox"), "math");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/myquizzes/math");
  });

});
