import { Layout } from '@ui/Layout'
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dbService } from '@services/db';
import { DashboardData } from '../domain';

import { Dashboard } from '@ui/Dashboard';

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const activities = await dbService.activity.findMany();
  const dashboardData = await dbService.task.dashboardTableQuery();
  const totalMins = activities.reduce((sum, item) => sum + item.time, 0);
  return {
    props: {
      totalMins,
      dashboardData,
    }
  };
}

type HomeProps = {
  totalMins: number;
  dashboardData: DashboardData;
}

const Home: FC<HomeProps> = ({ totalMins, dashboardData }) => {
  return (
    <Layout title='Dashboard'>
      <Dashboard data={dashboardData} />
      <br />
      <p>
        <strong>Total mins:</strong>
        &nbsp;
        <span>{totalMins}</span>
      </p>
    </Layout>
  )
};

export default Home;
