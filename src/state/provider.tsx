import { createContext, Dispatch, FC, useContext, useMemo, useReducer } from 'react';
import { Children } from '../types';
import { Action } from './actions';
import { dispatchAction, getProjectList, loadLastProject } from './reducer';
import {
  AreaConfig,
  Guide,
  Project,
  ProjectInfo,
  SimulationOptions,
  Source,
  VariableMap,
} from './types';

const Dispatch = createContext<Dispatch<Action>>(undefined as any);
const ProjectInfo = createContext<ProjectInfo>(undefined as any);
const ProjectList = createContext<Project[]>(undefined as any);
const Area = createContext<AreaConfig>(undefined as any);
const Sim = createContext<SimulationOptions>(undefined as any);
const Sources = createContext<Source[]>(undefined as any);
const Guides = createContext<Guide[]>(undefined as any);
const Globals = createContext<VariableMap>(undefined as any);
const Vars = createContext<VariableMap>(undefined as any);

export function useDispatch(): Dispatch<Action> {
  return useContext(Dispatch);
}

export function useProjectInfo(): ProjectInfo {
  return useContext(ProjectInfo);
}

export function useProjectList(): Project[] {
  return useContext(ProjectList);
}

export function useArea(): AreaConfig {
  return useContext(Area);
}

export function useSimulation(): SimulationOptions {
  return useContext(Sim);
}

export function useSources(): Source[] {
  return useContext(Sources);
}

export function useGuides(): Guide[] {
  return useContext(Guides);
}

export function useVariables(): VariableMap {
  return useContext(Vars);
}

export function useGlobals(): VariableMap {
  return useContext(Globals);
}

export const StateProvider: FC<Children> = ({ children }) => {
  const [project, dispatch] = useReducer(dispatchAction, undefined, loadLastProject);
  const info = useMemo(() => ({
    id: project.id,
    name: project.name,
    created: project.created,
    lastModified: project.lastModified,
  }), [project.id, project.name, project.created, project.lastModified]);

  return (
    <Dispatch.Provider value={dispatch}>
      <ProjectInfo.Provider value={info}>
        <ProjectList.Provider value={getProjectList()}>
          <Area.Provider value={project.area}>
            <Sim.Provider value={project.simulation}>
              <Sources.Provider value={project.sources}>
                <Guides.Provider value={project.guides}>
                  <Globals.Provider value={project.globals}>
                    <Vars.Provider value={project.variables}>
                      {children}
                    </Vars.Provider>
                  </Globals.Provider>
                </Guides.Provider>
              </Sources.Provider>
            </Sim.Provider>
          </Area.Provider>
        </ProjectList.Provider>
      </ProjectInfo.Provider>
    </Dispatch.Provider>
  );
};
