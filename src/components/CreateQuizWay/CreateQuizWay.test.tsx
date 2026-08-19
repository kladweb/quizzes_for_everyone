import React from "react";
import { vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { IWayCardsData } from "./wayCardsData";
import { CreateQuizWay } from "./CreateQuizWay";

const clickCallback = vi.fn();

const testCard: IWayCardsData = {
  id: "json",
  head: "Создайте пробный тест",
  features: [
    "строка описания 1",
    "строка описания 2",
    "строка описания 3",
    "строка описания 4",
    "строка описания 5",
  ],
};

const renderCreateQuizWay = (card: IWayCardsData, handleStartCreating: typeof clickCallback) => {
  render(
    <MemoryRouter>
      <CreateQuizWay card={card} handleStartCreating={handleStartCreating} />
    </MemoryRouter>
  );
};

describe("Creating quiz way card", () => {
  beforeEach(() => {
    renderCreateQuizWay(testCard, clickCallback);
  });

  it("renders creating quiz way card", () => {
    expect(screen.getByText(testCard.head)).toBeInTheDocument();
    // Проверяем, что все пункты списка отображаются
    testCard.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it("onClick is triggered when card is clicked", () => {
    // Находим ссылку по роли или по классу
    const link = screen.getByRole("link", { name: /Создайте пробный тест/i });
    fireEvent.click(link);
    expect(clickCallback).toHaveBeenCalledTimes(1);
  });

  it("has correct link to create quiz", () => {
    const link = screen.getByRole("link", { name: /Создайте пробный тест/i });
    expect(link).toHaveAttribute("href", "/createquiz/json");
  });
});
