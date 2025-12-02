import React, { useEffect, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { IStatistics } from "../../types/Quiz";
import "./statistics.css";

export const Statistics: React.FC<{ testId: string }> = ({testId}) => {
  const [statistics, setStatistics] = useState<IStatistics[] | null>(null);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `tests/${testId}/statistics`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray: IStatistics[] = [];
          Object.keys(data).forEach((key) => {
            dataArray.push(JSON.parse(data[key]));
          });
          setStatistics(dataArray);
        } else {
          console.log("Статистика не загружена");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {
        (statistics) ?
          <>
            {
              statistics.map(item => (
                <div className="statCard" key={item.finishedAt}>
                  <p>Дата выполения: <span>{(new Date(item.finishedAt)).toLocaleDateString()}</span></p>
                  <p>Имя: <span>{item.userName}</span></p>
                  <p>Результат: <span>{item.score}</span></p>
                </div>
              ))
            }
          </> :
          <div className="statCard">
            <p>Информация отсутствует. <span>Тест ещё никто не проходил.</span></p>
          </div>
      }
    </>
  )
}
