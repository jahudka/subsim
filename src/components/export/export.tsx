import { FC, useState } from 'react';
import { HiOutlineUpload } from 'react-icons/hi';
import { Dialog } from '../dialog';
import { useProject } from '../stateProvider';
import { ExportImage } from './image';
import { ExportJson } from './json';

export const Export: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button id="export" onClick={() => setOpen(true)}>
        <HiOutlineUpload />
      </button>
      {open && (
        <Dialog onClose={() => setOpen(false)}>
          {({ close }) => (
            <ExportDialog close={close} />
          )}
        </Dialog>
      )}
    </>
  );
};

type ExportDialogProps = {
  close: () => void;
};

const ExportDialog: FC<ExportDialogProps> = ({ close }) => {
  const { example, view, modified, ...project } = useProject();

  return (
    <div id="export-dialog">
      <h2>Export project</h2>
      <ExportImage projectName={project.name} close={close} />
      <ExportJson project={project} close={close} />
      <p className="text-center">
        <button onClick={close}>Close</button>
      </p>
    </div>
  );
};
