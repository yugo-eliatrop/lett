import { FC } from "react";
import { List } from "antd";
import Link from "next/link";
import { EditFilled } from "@ant-design/icons";
import cn from 'classnames';

import { Task } from '../../domain';
import { round } from "@utils/number-format";

import s from './TaskList.module.css';

type TaskListProps = {
  data: Task[];
}

export const TaskList: FC<TaskListProps> = ({ data }) => {

  if (data.length) {
    return (
      <List
        dataSource={data}
        itemLayout="horizontal"
        renderItem={(task) => (
          <List.Item className={s.item} actions={[<Link href={`/task/${task.id}`} key="edit"><EditFilled /></Link>]}>
            <List.Item.Meta
              title={(
                <Link href={`/task/play/${task.id}`}>
                  <strong className={cn(task.active || s.disabled)}>{task.title}</strong>
                </Link>
              )}
              description={(
                <Link href={`/task/play/${task.id}`}>
                  <span>{task.time} mins per week, {round(task.time / 7)} per day</span>
                </Link>
              )}
            />
          </List.Item>
        )}
      />
    )
  }

  return <p>No tasks yet</p>
};
