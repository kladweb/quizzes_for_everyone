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
    "несложный и относительно быстрый способ при использовании стороннего ИИ;",
    "тест по описанию или примеру;",
    "тест по книге или отдельному параграфу, pdf-файлу, docx-документу и т.д.;",
    "JSON-файл легко получить при помощи стороннего ИИ;",
    "бесплатно."
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
