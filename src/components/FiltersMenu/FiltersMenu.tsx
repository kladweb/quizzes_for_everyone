import React from "react";
import { useNavigate } from "react-router-dom";
import { CAT_LABELS_RU_EXT } from "../../variables/quizData";
import "./filtersMenu.css";

export interface IFiltersMenu {
  category?: string;
  uniqueCategories: string[];
  pageQuizzes: "allquizzes" | "myquizzes";
}

export const FiltersMenu: React.FC<IFiltersMenu> = ({category, uniqueCategories, pageQuizzes}) => {
  const navigate = useNavigate();
  const selectedCategory = category ?? "all";

  const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      navigate(`/${pageQuizzes}`);
    } else {
      navigate(`/${pageQuizzes}/${value}`);
    }
  };

  return (
    <div className="filters-menu">
      <select
        className="input-category input-filters"
        value={selectedCategory}
        onChange={changeCategory}
      >
        {uniqueCategories.map((item) => (
          <option key={item} value={item}>
            {CAT_LABELS_RU_EXT[item] ?? item}
          </option>
        ))}
      </select>
    </div>
  );
}
