import { ChangeEvent, Dispatch, FC } from 'react';
import { HiOutlineDocumentAdd } from 'react-icons/hi';
import { $, Action } from '../../state';
import { useDispatch } from '../stateProvider';

export const ImportProject: FC = () => {
  const dispatch = useDispatch();

  return (
    <label className="project-import flex-min px-2">
      <input type="file" accept="application/json" onChange={(evt) => importProject(evt, dispatch)} />
      <HiOutlineDocumentAdd />
      import
    </label>
  );
};

function importProject(evt: ChangeEvent, dispatch: Dispatch<Action>): void {
  const file = (evt.target as HTMLInputElement).files?.item(0);

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      dispatch($.proj.import(data));
    } catch {
    }
  };

  reader.readAsText(file, 'utf-8');
}
