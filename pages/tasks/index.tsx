import { FC } from "react";
import { Task } from '../../domain';
import { GetServerSideProps } from "next";
import { dbService } from "../../services/db";
import { Layout } from "../../ui/Layout";
import { TaskCard } from "../../ui/TaskCard";

export const getServerSideProps: GetServerSideProps<TasksPageProps> = async () => {
  const tasks = await dbService.task.findMany();
  return { props: { tasks } };
}

type TasksPageProps = {
  tasks: Task[];
}

const TasksPage: FC<TasksPageProps> = ({ tasks }) => {

  return (
    <Layout title="Tasks">
      {tasks.map(task => <TaskCard data={task} key={task.id} />)}
    </Layout>
  )
};

export default TasksPage;
