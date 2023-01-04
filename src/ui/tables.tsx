import { FC, ReactNode } from 'react';

export type RowProps = {
  id?: string;
  label?: string;
  children: ReactNode | ReactNode[];
};

export const Row: FC<RowProps> = ({ id, label, children }) => {
  const childrenList = Array.isArray(children) ? children : [children];

  return (
    <tr>
      <th><label htmlFor={id}>{label ?? childrenList[0]}</label></th>
      <td>{childrenList[label ? 0 : 1]}</td>
      <td>{childrenList[label ? 1 : 2]}</td>
      {childrenList.length > (label ? 2 : 3) && <td className="text-right">{childrenList[label ? 2 : 3]}</td>}
    </tr>
  );
}
