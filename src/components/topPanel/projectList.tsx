import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { FaFolderOpen, FaFolderPlus, FaTrash } from 'react-icons/fa';
import { ProjectInfo } from '../../state';
import { Button } from '../button';
import { useCurrent } from '../hooks';
import { $, useDispatch, useProjectInfo, useProjectList } from '../stateProvider';

export type ProjectListProps = {
  close?: () => void;
};

export const ProjectList: FC<ProjectListProps> = ({ close }) => {
  const projects = useProjectList();
  const current = useProjectInfo();
  const dispatch = useDispatch();
  const closeCb = useCurrent(close);

  const create = useCallback(() => {
    dispatch($.proj.create());
    closeCb.current && closeCb.current();
  }, [dispatch, closeCb])

  const load = useCallback((id: string) => {
    dispatch($.proj.load(id));
    closeCb.current && closeCb.current();
  }, [dispatch, closeCb]);

  const del = useCallback((id: string) => {
    dispatch($.proj.del(id));
  }, [dispatch]);

  return (
    <div className="project-list">
      <div className="row">
        <h2 className="flex-max">Projects:</h2>
        <button className="flex-min" onClick={create}>
          <FaFolderPlus />
        </button>
      </div>
      {projects.map((project) => (
        <ProjectEntry
          key={project.id}
          project={project}
          current={project.id === current.id}
          currentModified={current.modified}
          load={load}
          del={del} />
      ))}
    </div>
  );
};

type ProjectEntryProps = {
  project: ProjectInfo;
  current: boolean;
  currentModified?: boolean;
  load: (id: string) => void;
  del: (id: string) => void;
};

const ProjectEntry: FC<ProjectEntryProps> = ({ project, current, currentModified, load, del }) => (
  <div className={classNames('row', current && 'current')}>
    <div className="flex-max">
      <h3>{project.example && 'Example:'} {project.name}</h3>
      <small className="text-muted">
        created: {formatDate(project.created)}
        <span className="inline-sep" />
        modified: {formatDate(project.lastModified)}
      </small>
    </div>
    <div className="flex-min ml-1 text-nowrap">
      <Button
        onClick={() => load(project.id)}
        confirm={currentModified && <>Are you sure you want to {current ? 'reload this' : 'load another'} project?<br />Any unsaved changes will be lost.</>}>
        <FaFolderOpen />
      </Button>
      <Button
        className="ml-1"
        disabled={current || project.example}
        onClick={() => del(project.id)}
        confirm="Are you sure you want to delete this project?">
        <FaTrash />
      </Button>
    </div>
  </div>
);


function formatDate(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const h = date.getHours();
  const i = date.getMinutes();
  return `${d}/${m} ${y} ${h}:${i.toString().padStart(2, '0')}`;
}
