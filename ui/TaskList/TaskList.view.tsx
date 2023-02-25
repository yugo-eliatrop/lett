import { EditFilled } from '@ant-design/icons';
import { routes } from '@routes';
import { TaskTitle } from '@ui/TaskTitle';
import { round } from '@utils/number-format';
import { List } from 'antd';
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
                    <strong className={cn(task.active || s.disabled)}>{task.title}</strong>
                  </TaskTitle>
                </Link>
              }
              description={
                <Link href={routes.task(task.id)}>
                  <span>{task.time} mins per week</span>
                  {task.isDaily && <span>,&nbsp;{round(task.time / 7)} per day</span>}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    );
  }

  return <p>No tasks yet</p>;
};
