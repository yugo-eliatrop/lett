import { ActivitiesStatistics } from '@domain/activity';
import { toDDMMYY } from '@utils/time-format';
import { FC } from 'react';

import s from './ActivityStatistics.module.css';

type ActivityStatisticsProps = {
  data: ActivitiesStatistics;
  goalTime: number;
};

export const ActivityStatisticsView: FC<ActivityStatisticsProps> = ({ data, goalTime }) => {
  const total = data.reduce((sum, item) => (sum += item.time), 0);
  const rest = goalTime - total;

  if (data.length)
    return (
      <>
        {data.map(st => (
          <div className={s.line} key={st.id}>
            <span>{toDDMMYY(st.day)}</span>
            <span>{st.time}</span>
          </div>
        ))}
        <div className={s.line}>
          <strong>TOTAL:</strong>
          <strong>{total}</strong>
        </div>
        <div className={s.line}>
          <span>Rest:</span>
          <span>{rest > 0 ? rest : 0}</span>
        </div>
      </>
    );

  return <p>No statistics yet</p>;
};
