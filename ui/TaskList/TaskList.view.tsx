import { EditFilled } from '@ant-design/icons';
import { routes } from '@routes';
import { TaskTitle } from '@ui/TaskTitle';
import { round } from '@utils/number-format';
import { List, Typography } from 'antd';
import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

import { Task } from '../../domain';
import s from './TaskList.module.css';

type TaskListProps = {
  data: Task[];
  runningTaskIds: Set<number>;
};

export const TaskList: FC<TaskListProps> = ({ data, runningTaskIds }) => {
  if (data.length) {
    return (
      <List
        dataSource={data}
        itemLayout="horizontal"
        renderItem={task => (
          <List.Item
            className={s.item}
            actions={[
              <Link href={routes.taskEdit(task.id)} key="edit">
                <EditFilled />
              </Link>,
            ]}
          >
            <List.Item.Meta
              title={
                <Link href={routes.task(task.id)}>
                  <TaskTitle isRunning={runningTaskIds.has(task.id)}>
                    <Typography.Text className={cn(task.active || s.disabled)}>{task.title}</Typography.Text>
                  </TaskTitle>
                </Link>
              }
              description={
                <Link href={routes.task(task.id)}>
                  <Typography.Text type="secondary">{task.time} mins per week</Typography.Text>
                  {task.isDaily && (
                    <Typography.Text type="secondary">,&nbsp;{round(task.time / 7)} per day</Typography.Text>
                  )}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    );
  }

  return <Typography.Text>No tasks yet</Typography.Text>;
};
