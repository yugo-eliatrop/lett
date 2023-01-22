import { FC } from "react";
import { Task } from '../../domain';
import { GetServerSideProps } from "next";
import { dbService } from "../../services/db";
import { Layout } from "../../ui/Layout";
import { TaskCard } from "../../ui/TaskCard";

export const getServerSideProps: GetServerSideProps<TasksPageProps> = async () => {
  const rawTasks = (await dbService.task.findMany()).sort((a, b) => a.title > b.title ? 1 : -1)
  const activeTasks = rawTasks.filter(t => t.active);
  const disabledTasks = rawTasks.filter(t => !t.active);
  return { props: { tasks: [ ...activeTasks, ...disabledTasks ] } };
}

type TasksPageProps = {
  tasks: Task[];
}

const TasksPage: FC<TasksPageProps> = ({ tasks }) => {

  return (
    <Layout title="Tasks">
      {tasks.length ? tasks.map(task => <TaskCard data={task} key={task.id} />) : <p>Not tasks yet</p>}
    </Layout>
  )
};

export default TasksPage;
