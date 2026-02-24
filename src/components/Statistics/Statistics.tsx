import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { IStatistics } from "../../types/Quiz";
import "./statistics.css";

export const Statistics: React.FC<{ testId: string }> = ({testId}) => {
  const [statistics, setStatistics] = useState<IStatistics[] | null>(null);

  const deleteStat = async (currentIdStat: string) => {
    await set(ref(database, `statistics/${testId}/${currentIdStat}`), null);
    if (statistics) {
      const newStat: IStatistics[] = statistics.filter((stat: IStatistics) => stat.statId !== currentIdStat);
      if (newStat.length === 0) {
        setStatistics(null);
      } else {
        setStatistics(newStat);
      }
    }
  }

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `statistics/${testId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray: string[] = Object.values(data);

          const dataArrayObj: IStatistics[] = dataArray.map((stat) => JSON.parse(stat));
          setStatistics(dataArrayObj);
        } else {
          console.log("Статистика не загружена");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="statistics-block">
      {
        (statistics) ?
          <>
            {
              statistics.map(item => (
                <div className="stat-card" key={item.statId}>
                  <button className="btn-delete" title="Удалить" onClick={() => deleteStat(item.statId)}>✖</button>
                  <p>Дата выполнения: <span>{(new Date(item.finishedAt)).toLocaleDateString()}</span></p>
                  <p>Имя: <span>{item.userName}</span></p>
                  <p>Результат: <span>{item.score}</span></p>
                </div>
              ))
            }
          </>
          :
          <div className="stat-card">
            <p>Информация отсутствует. <span>Возможно, история очищена.</span></p>
          </div>
      }
    </div>
  )
}
