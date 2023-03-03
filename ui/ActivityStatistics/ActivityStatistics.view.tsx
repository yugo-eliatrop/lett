import * as RD from '@devexperts/remote-data-ts';
import { ActivitiesStatistics } from '@domain/activity';
import { Blackout } from '@ui/Blackout';
import { Typography } from 'antd';
import { FC, useEffect, useState } from 'react';

import { ActivityStatisticsTableView } from './ActivityStatisticsTable.view';

type ActivityStatisticsProps = {
  data: RD.RemoteData<Error, ActivitiesStatistics>;
  goalTime: number;
};

export const ActivityStatisticsView: FC<ActivityStatisticsProps> = ({ data, goalTime }) => {
  const [lastData, setLastData] = useState<ActivitiesStatistics>([]);

  useEffect(() => {
    if (RD.isSuccess(data)) {
      setLastData(data.value);
    }
  }, [data, setLastData]);

  if (RD.isFailure(data)) {
    return <Typography.Text>{data.error.message}</Typography.Text>;
  }

  return (
    <Blackout isActive={RD.isPending(data) || RD.isInitial(data)}>
      <ActivityStatisticsTableView data={lastData} goalTime={goalTime} />
    </Blackout>
  );
};
