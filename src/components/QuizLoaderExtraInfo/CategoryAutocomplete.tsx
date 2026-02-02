import React from "react";
import {QUIZ_CATEGORIES} from "./quizCategories";

interface IPropsCategoryAutocomplete {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryAutocomplete: React.FC<IPropsCategoryAutocomplete> = ({value, onChange}) => {
  const [query, setQuery] = React.useState(value || "");
  const [open, setOpen] = React.useState(false);

  const filtered = QUIZ_CATEGORIES.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(category: string) {
    setQuery(category);
    onChange(category);
    setOpen(false);
  }

  return (
    <div className="autocomplete">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder="Выберите категорию"
      />

      {open && filtered.length > 0 && (
        <ul className="autocomplete-list">
          {filtered.map((cat) => (
            <li key={cat} onMouseDown={() => handleSelect(cat)}>{cat}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
