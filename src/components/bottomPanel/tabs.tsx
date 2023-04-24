import classNames from 'classnames';
import { FC } from 'react';

export type TabsProps = {
  current: string;
  setCurrent: (current: string) => void;
};

const tabs: [string, string][] = [
  ['sources', 'sources'],
  ['guides', 'guides'],
  ['vars', 'variables'],
  ['sim', 'options'],
];

export const Tabs: FC<TabsProps> = ({ current, setCurrent }) => (
  <div id="bottom-tabs" className="row">
    {tabs.map(([id, label]) => (
      <button key={id} data-tooltip={`${id}.tab`} onClick={() => setCurrent(id)} className={classNames('flex-min', current === id && 'current')}>{label}</button>
    ))}
  </div>
);
