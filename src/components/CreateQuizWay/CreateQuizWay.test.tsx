import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { IWayCardsData } from "./wayCardsData";
import { CreateQuizWay } from "./CreateQuizWay";

interface IDataCreateQuizWayProps {
  card: IWayCardsData;
  handlerCreateWay: () => void;
}

const clickCallback = vi.fn();

const testCard = {
  id: "json",
  head: "Создайте пробный тест",
  features: [
    "строка описания 1",
    "строка описания 2",
    "строка описания 3",
    "строка описания 4",
    "строка описания 5",
  ]
}

const testProps: IDataCreateQuizWayProps = {
  card: testCard,
  handlerCreateWay: clickCallback,
}


const renderCreateQuizWay = (props: IDataCreateQuizWayProps) => {
  render(
    <CreateQuizWay
      card={testCard}
      handlerCreateWay={props.handlerCreateWay}
    />
  )
}

describe("Creating quiz way card", () => {
  renderCreateQuizWay(testProps);
  it("renders creating quiz way card", () => {
    expect(screen.getByText(testCard.head)).toBeInTheDocument();
  })
});
