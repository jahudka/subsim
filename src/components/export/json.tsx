import { FC } from 'react';
import { HiOutlineDownload } from 'react-icons/hi';
import { Project } from '../../state';
import { sanitizeFileName } from './utils';

export type ExportJsonProps = {
  project: Project;
  close: () => void;
};

export const ExportJson: FC<ExportJsonProps> = ({ project, close }) => (
  <div className="row mt-2">
    <div className="text-nowrap">
      <strong>Export data:</strong>
    </div>
    <div className="flex-max ml-2">
      <button onClick={() => downloadProject(project, close)}>
        <HiOutlineDownload /> JSON
      </button>
      <p className="my-1">
        <em>You can import the JSON file back into Subsim later using the "Import" button in the Project list</em>
      </p>
    </div>
  </div>
);

function downloadProject({ id, ...project }: Project, close: () => void): void {
  const el = document.createElement('a');
  el.href = `data:application/json;base64,${btoa(JSON.stringify(project, null, 2))}`;
  el.download = `${sanitizeFileName(project.name)}.json`;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
  close();
}
