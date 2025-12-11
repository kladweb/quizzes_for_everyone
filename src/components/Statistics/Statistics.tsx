import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { IStatistics } from "../../types/Quiz";
import "./statistics.css";

export const Statistics: React.FC<{ testId: string }> = ({testId}) => {
  const [statistics, setStatistics] = useState<IStatistics[] | null>(null);

  const deleteStat = async (currentIdStat: number) => {
    await set(ref(database, `tests/${testId}/statistics/${currentIdStat}`), null);
    if (statistics) {
      const newStat = statistics.filter((stat) => stat.finishedAt !== currentIdStat);
      setStatistics(newStat);
    }
  }

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
                  <button className="buttonClose" title="Удалить" onClick={() => deleteStat(item.finishedAt)}>✖</button>
                  <p>Дата выполнения: <span>{(new Date(item.finishedAt)).toLocaleDateString()}</span></p>
                  <p>Имя: <span>{item.userName}</span></p>
                  <p>Результат: <span>{item.score}</span></p>
                </div>
              ))
            }
          </>
          :
          <div className="statCard">
            <p>Информация отсутствует. <span>Тест ещё никто не проходил.</span></p>
          </div>
      }
    </>
  )
}
