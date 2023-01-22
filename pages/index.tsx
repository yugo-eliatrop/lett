import Head from 'next/head'
import { Layout } from '../ui/Layout'
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dbService } from '../services/db';
import { Task } from '../domain';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { pipe, flow } from 'fp-ts/lib/function';

export const getServerSideProps: GetServerSideProps<DashboardProps> = async () => {
  const activities = await dbService.activity.findMany();
  const mostPopularTask = await pipe(
    TO.tryCatch(() => dbService.task.mostPopular()),
    TO.chain(flow(TO.fromNullable)),
    TO.map(t => ({ ...t, time: Number(t.time) })),
  )();
  const totalMins = activities.reduce((sum, item) => sum + item.time, 0);
  return {
    props: {
      totalMins,
      mostPopularTask,
    }
  };
}

type DashboardProps = {
  totalMins: number;
  mostPopularTask: O.Option<Task>;
}

const Dashboard: FC<DashboardProps> = ({ totalMins, mostPopularTask }) => {
  return (
    <>
      <Head>
        <title>LETT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title='Dashboard'>
        <p>
          <strong>Total mins:</strong>
          &nbsp;
          <span>{totalMins}</span>
        </p>
        <p>
          <strong>Most popular task:</strong>
          &nbsp;
          {
            pipe(
              mostPopularTask,
              O.fold(
                () => <span>not found</span>,
                (t) => <span>{t.title} ({t.time} mins)</span>
              )
            )
          }
        </p>
      </Layout>
    </>
  )
};

export default Dashboard;
