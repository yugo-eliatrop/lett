import * as RD from '@devexperts/remote-data-ts';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { pipe } from 'fp-ts/lib/function';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

import { EditedTask } from '../../domain';
import { Blackout } from '../../ui/Blackout';
import s from './TaskForm.module.css';
import { SubmitStatus } from './types';

type TaskFormViewProps = {
  editedTask?: EditedTask;
  onSubmit: (f: EditedTask) => void;
  onRemove: (f: EditedTask) => void;
  status: SubmitStatus;
};

export const TaskFormView: FC<TaskFormViewProps> = ({ onSubmit, onRemove, status, editedTask }) => {
  const onFinish = (v: {
    title: string;
    time: string;
    active: boolean;
    trackable: boolean;
    isDaily: boolean;
    goal: string;
  }) => {
    onSubmit({ ...v, time: +v.time, id: editedTask?.id, goal: v.goal ? +v.goal : null });
  };

  const router = useRouter();

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    pipe(
      status,
      RD.fold(
        () => null,
        () => null,
        e =>
          modal.error({
            title: 'Error',
            content: e.message,
          }),
        d =>
          modal.success({
            title: 'Success',
            content: `Task ${d.title} successfully handled`,
            onOk: () => router.push('/tasks'),
          })
      )
    );
  }, [status]);

  const showConfirmationModal = () =>
    editedTask &&
    modal.confirm({
      title: 'Confirm removing',
      content: 'Are you sure to remove the task?',
      onOk: () => onRemove(editedTask),
    });

  return (
    <>
      <Blackout isActive={RD.isPending(status)}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={
            editedTask || { title: '', time: 35, active: true, trackable: true, isDaily: true, goal: null }
          }
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input title of task' }]}>
            <Input minLength={3} />
          </Form.Item>

          <Form.Item label="Time per week" name="time" rules={[{ required: true, message: 'Please input time' }]}>
            <Input type="number" min={35} />
          </Form.Item>

          <Form.Item label="Goal (hours)" name="goal">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="active" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Active</Checkbox>
          </Form.Item>

          <Form.Item name="trackable" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Trackable by dashboard</Checkbox>
          </Form.Item>

          <Form.Item name="isDaily" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Is daily routine</Checkbox>
          </Form.Item>

          <Form.Item className={s.buttons}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {editedTask?.id && (
              <Button type="primary" danger onClick={showConfirmationModal}>
                Remove
              </Button>
            )}
          </Form.Item>
        </Form>
      </Blackout>
      {contextHolder}
    </>
  );
};
