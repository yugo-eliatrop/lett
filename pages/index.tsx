import { Layout } from '@ui/Layout'
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dbService } from '@services/db';
import { DashboardData } from '../domain';
import { pipe } from 'fp-ts/lib/function';
import * as TO from 'fp-ts/TaskOption';
import * as T from 'fp-ts/Task';

import { Dashboard } from '@ui/Dashboard';
import { round } from '@utils/number-format';

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const activities = await dbService.activity.findMany();
  const dashboardData = await dbService.task.dashboardTableQuery();
  const deutschTotalHours = await pipe(
    TO.tryCatch(() => dbService.task.findFirst({ where: { title: 'Deutsch' } }).activities()),
    TO.chain(TO.fromNullable),
    TO.map(activities => activities.reduce((sum, item) => sum += item.time, 0)),
    TO.map(mins => round(mins / 60)),
    TO.getOrElse(() => T.of(0)),
  )();
  const totalMins = activities.reduce((sum, item) => sum + item.time, 0);
  return {
    props: {
      totalMins,
      dashboardData,
      deutschTotalHours
    }
  };
}

const deutschHoursGoal = 300;

type HomeProps = {
  totalMins: number;
  dashboardData: DashboardData;
  deutschTotalHours: number;
}

const Home: FC<HomeProps> = ({ totalMins, dashboardData, deutschTotalHours }) => {
  return (
    <Layout title='Dashboard'>
      <Dashboard data={dashboardData} />
      <br />
      <p>
        <strong>Total mins:</strong>
        &nbsp;
        <span>{totalMins}</span>
      </p>
      {deutschTotalHours && (
        <p>
          <strong>Deutsch hours:</strong>
          &nbsp;
          <span>{deutschTotalHours}</span>
          <span>&nbsp;/&nbsp;{round(deutschTotalHours / deutschHoursGoal, 2)}% done</span>
        </p>
      )}
    </Layout>
  )
};

export default Home;
