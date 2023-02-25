import { FC } from 'react';

import { TaskForm } from '../../features/TaskForm';
import { Layout } from '../../ui/Layout';

export const CreateTaskPage: FC = () => {
  return (
    <Layout title="Create task">
      <TaskForm />
    </Layout>
  );
};

export default CreateTaskPage;
