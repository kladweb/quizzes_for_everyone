import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LIST } from "../../variables/quizData";

interface IFiltersMenu {
  category?: string;
  pageQuizzes: "allquizzes" | "myquizzes";
}

export const FiltersMenu: React.FC<IFiltersMenu> = ({category, pageQuizzes}) => {
  const navigate = useNavigate();
  const selectedCategory = category ?? "all";

  const sortedCategories = useMemo(() => {
    const keys = Object.keys(CATEGORY_LIST).filter(k => k !== "all");
    const sorted = keys.sort((a, b) =>
      CATEGORY_LIST[a].localeCompare(CATEGORY_LIST[b], "ru")
    );
    return ["all", ...sorted];
  }, []);

  const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      navigate(`/${pageQuizzes}`);
    } else {
      navigate(`/${pageQuizzes}/${value}`);
    }
  };

  return (
    <div>
      <select
        className="input-language"
        value={selectedCategory}
        onChange={changeCategory}
      >
        {sortedCategories.map((item) => (
          <option key={item} value={item}>
            {CATEGORY_LIST[item]}
          </option>
        ))}
      </select>
    </div>
  );
}
