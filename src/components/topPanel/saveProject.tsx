import { FC, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Dialog } from '../dialog';
import { BooleanField, StringField } from '../fields';
import { $, useDispatch, useProjectInfo } from '../stateProvider';

export type SaveProjectProps = {
  onClose?: () => void;
};

function validateName(name: string): string {
  if (!name.length) {
    throw new Error('Name is required');
  }

  return name;
}

export const SaveProject: FC<SaveProjectProps> = ({ onClose }) => {
  const project = useProjectInfo();
  const [name, setName] = useState(project.name);
  const [copy, setCopy] = useState(project.example ?? false);
  const dispatch = useDispatch();
  const done = (save?: boolean) => {
    save && dispatch($.proj.save(name, copy));
    onClose && onClose();
  };

  return (
    <Dialog onClose={done}>
      {({ done, close }) => (
        <div id="project-save">
          <h2>Save project</h2>
          <div className="row">
            <label htmlFor="project-save-name" className="flex-2 mr-1">Name:</label>
            <StringField id="project-save-name" className="flex-max" value={name} onChange={setName} validate={validateName} />
          </div>
          <div className="row">
            <div className="flex-min mx-auto">
              <BooleanField value={copy} onChange={setCopy} disabled={project.example}>
                Save as a copy
              </BooleanField>
            </div>
          </div>
          <p className="text-center">
            <button onClick={() => done(true)} disabled={!name} className="mr-2"><FaSave /></button>
            <button onClick={close}><FaTimes /></button>
          </p>
        </div>
      )}
    </Dialog>
  );
};
