import { Card } from "antd";
import { useRouter } from "next/router";
import { FC } from "react";
import { Task } from "../../domain";
import { SettingFilled, CaretRightFilled } from "@ant-design/icons"

import s from './TaskCard.module.css';

type TaskCardProps = {
  data: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ data: { title, id, active, time } }) => {
  const router = useRouter();

  return (
    <Card
      className={s.card}
      actions={[
        <SettingFilled onClick={() => router.push(`/task/${id}`)} />,
        <CaretRightFilled />
      ]}
    >
      <Card.Meta
        title={title}
        description={<>
          {!active && <p><strong>Disabled</strong></p>}
          <p>Time: {time} mins</p>
        </>}
      />
    </Card>
  )
};
