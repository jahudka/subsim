import { Dispatch, FC, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Action,
  proj,
  Project,
  useDispatch,
  useProjectList,
  useProjectInfo,
  ProjectInfo,
} from '../state';
import { StringField } from './fields';
import { Row } from './tables';

export const ProjectUI: FC = () => {
  const project = useProjectInfo();
  const [visible, setVisible] = useState(false);

  return (
    <span>
      {project.name}
      <button className="btn btn-dropdown" onClick={() => setVisible(!visible)}></button>
      {visible && <ProjectListUI current={project} close={() => setVisible(false)} />}
    </span>
  );
};

type ProjectListUIProps = {
  current: ProjectInfo;
  close: () => void;
};

const ProjectListUI: FC<ProjectListUIProps> = ({ current, close }) => {
  const projects = useProjectList();
  const dispatch = useDispatch();

  return createPortal(
    <div id="project-list">
      <h2>Current project</h2>
      <CurrentProject project={current} dispatch={dispatch} />
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
            <ProjectRow key={project.id} project={project} isCurrent={project.id === current.id} dispatch={dispatch} />
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

type CurrentProjectProps = {
  project: ProjectInfo;
  dispatch: Dispatch<Action>;
};

const CurrentProject: FC<CurrentProjectProps> = ({ project, dispatch }) => {
  const isExample = /^examples\//.test(project.id);

  return (
    <table>
      <tbody>
        {isExample ? (
          <tr>
            <th>Name:</th>
            <td>{project.name} <em>(example project)</em></td>
          </tr>
        ) : (
          <Row id="curr-proj-name" label="Name:">
            <StringField
              id="curr-proj-name" value={project.name} onChange={name => dispatch(proj.setName(name))} />
          </Row>
        )}
        <tr>
          <th>Created:</th>
          <td>{project.created.toLocaleString()}</td>
        </tr>
        <tr>
          <th>Last modified:</th>
          <td>{project.lastModified.toLocaleString()}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2}>
            <ProjectActions project={project} isCurrent={true} isExample={isExample} dispatch={dispatch} />
          </td>
        </tr>
      </tfoot>
    </table>
  )
};

type ProjectRowProps = {
  project: Project;
  isCurrent: boolean;
  dispatch: Dispatch<Action>;
};

const ProjectRow: FC<ProjectRowProps> = ({ project, isCurrent, dispatch }) => {
  const isExample = /^examples\//.test(project.id);
  const label = `${isExample ? 'example: ' : ''}${project.name}`;

  return (
    <tr>
      {isCurrent ? <th>{label}</th> : <td>{label}</td>}
      <td>{project.created.toLocaleString()}</td>
      <td>{project.lastModified.toLocaleString()}</td>
      <td className="text-right">
        <ProjectActions project={project} isCurrent={isCurrent} isExample={isExample} dispatch={dispatch} />
      </td>
    </tr>
  );
};

type ProjectActionsProps = {
  project: Project | ProjectInfo;
  isCurrent: boolean;
  isExample: boolean;
  dispatch: Dispatch<Action>;
};

const ProjectActions: FC<ProjectActionsProps> = ({ project, isCurrent, isExample, dispatch }) => {
  return isCurrent ? (
    <>
      <button className="btn btn-add" onClick={() => dispatch(proj.load(project.id))}>reload</button>
      {!isExample && <button className="btn btn-add" onClick={() => dispatch(proj.save())}>save</button>}
    </>
  ) : (
    <>
      <button className="btn btn-add" onClick={() => dispatch(proj.load(project.id))}>load</button>
      {!isExample && <button className="btn btn-delete" onClick={() => dispatch(proj.del(project.id))}>delete</button>}
    </>
  );
};
