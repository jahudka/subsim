import { FC, useState } from 'react';
import { FaSave, FaSyncAlt } from 'react-icons/fa';
import { Button } from '../button';
import { $, useDispatch, useProjectInfo } from '../stateProvider';
import { SaveProject } from './saveProject';

export const CurrentProject: FC = () => {
  const [save, setSave] = useState(false);
  const dispatch = useDispatch();
  const info = useProjectInfo();

  return (
    <div className="row current-project">
      <h2 className="flex-max">
        <div>{info.example && 'Example:'} {info.name}{!info.example && info.modified ? '*' : ''}</div>
      </h2>
      <button className="flex-min ml-1" onClick={() => setSave(true)}><FaSave /></button>
      <Button
        className="flex-min ml-1"
        onClick={() => dispatch($.proj.reload())}
        confirm={info.modified && <>Are you sure you want to reload the project?<br />Any unsaved changes will be lost.</>}>
        <FaSyncAlt />
      </Button>
      {save && <SaveProject onClose={() => setSave(false)} />}
    </div>
  );
};
