import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { proj, useDispatch, useProjectList, useProjectName } from '../state';

export const ProjectUI: FC = () => {
  const name = useProjectName();
  const [visible, setVisible] = useState(false);

  return (
    <span>
      {name}
      <button className="btn btn-dropdown" onClick={() => setVisible(!visible)}></button>
      {visible && <ProjectListUI current={name} close={() => setVisible(false)} />}
    </span>
  );
};

type ProjectListUIProps = {
  current: string;
  close: () => void;
};

const ProjectListUI: FC<ProjectListUIProps> = ({ current, close }) => {
  const projects = useProjectList();
  const dispatch = useDispatch();

  return createPortal(
    <div id="project-list">
      <h2>Project list</h2>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Created</th>
            <th>Last modified</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.name}>
              {project.name === current ? <th>{project.name}</th> : <td>{project.name}</td>}
              <td>{project.created.toLocaleString()}</td>
              <td>{project.lastModified.toLocaleString()}</td>
              <td className="text-right">
                {project.name === current ? (
                  <>
                    <button className="btn btn-add" onClick={() => dispatch(proj.save(project.name))}>save</button>
                    <button className="btn btn-add" onClick={() => dispatch(proj.load(project.name))}>reload</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-add" onClick={() => dispatch(proj.load(project.name))}>load</button>
                    <button className="btn btn-delete" onClick={() => dispatch(proj.del(project.name))}>delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <button className="btn btn-add" onClick={() => dispatch(proj.create())}>new project</button>
              <button className="btn" onClick={close}>close</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>,
    document.body,
  );
};
