import { ActivitiesStatistics } from '@domain/activity';
import { toDDMMYY, toMMSS } from '@utils/time-format';
import { Typography } from 'antd';
import { FC } from 'react';

import s from './ActivityStatistics.module.css';

type ActivityStatisticsTableProps = {
  data: ActivitiesStatistics;
  goalTime: number;
};

export const ActivityStatisticsTableView: FC<ActivityStatisticsTableProps> = ({ data, goalTime }) => {
  const total = data.reduce((sum, item) => (sum += item.time), 0);
  const rest = goalTime - total;

  if (data.length)
    return (
      <>
        {data.map(st => (
          <div className={s.line} key={st.id}>
            <Typography.Text>{toDDMMYY(st.day)}</Typography.Text>
            <Typography.Text className={s.code}>{toMMSS(st.time)}</Typography.Text>
          </div>
        ))}
        <div className={s.line}>
          <Typography.Text strong>TOTAL:</Typography.Text>
          <Typography.Text strong className={s.code}>
            {toMMSS(total)}
          </Typography.Text>
        </div>
        <div className={s.line}>
          <Typography.Text>Rest:</Typography.Text>
          <Typography.Text className={s.code}>{toMMSS(rest > 0 ? rest : 0)}</Typography.Text>
        </div>
      </>
    );

  return <Typography.Text>No statistics yet</Typography.Text>;
};
