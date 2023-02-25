import { FC, PropsWithChildren } from 'react';

import s from './Description.module.css';

export type DescriptionProps = PropsWithChildren;

export const Description: FC<DescriptionProps> = ({ children }) => <div className={s.description}>{children}</div>;
