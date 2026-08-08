import React, { ChangeEvent } from "react";
import { IUserParams, userParams } from "../../variables/quizData";
import "./filtersUsers.css";

export interface IFiltersUsers {
  setUserParam: (userParam: IUserParams) => void;
}

export const FiltersUsers: React.FC<IFiltersUsers> = ({setUserParam}) => {
  return (
    <div className="filters-users">
      <select className="input-category input-users"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setUserParam(e.target.value as IUserParams)}
      >
        {Object.keys(userParams).map((param) => (
          <option key={param} value={param}>
            {userParams[param as IUserParams]}
          </option>
        ))}
      </select>
    </div>
  )
}
