import { createContext, Dispatch, FC, useReducer } from 'react';
import { EngineInterface } from '../engine';
import { useContextSafely } from './hooks';
import { Children } from './types';
import {
  engine,
  dispatchAction,
  getProjectList,
  loadLastProject,
  Action,
  Guide,
  ProjectInfo,
  SimulationOptions,
  Source,
  Generator,
  VariableMap,
  LocalVariableMap,
  ViewState,
  ProjectState,
} from '../state';

export { $ } from '../state';

const Dispatch = createContext<Dispatch<Action> | undefined>(undefined);
const Project = createContext<ProjectState | undefined>(undefined);
const ProjectList = createContext<ProjectInfo[] | undefined>(undefined);
const ProjectInfo = createContext<ProjectInfo | undefined>(undefined);
const Sim = createContext<SimulationOptions | undefined>(undefined);
const View = createContext<ViewState | undefined>(undefined);
const Sources = createContext<(Source | Generator)[] | undefined>(undefined);
const Guides = createContext<Guide[] | undefined>(undefined);
const Globals = createContext<VariableMap | undefined>(undefined);
const Vars = createContext<LocalVariableMap | undefined>(undefined);


export function useDispatch(): Dispatch<Action> {
  return useContextSafely(Dispatch);
}

export function useEngine(): EngineInterface {
  return engine;
}

export function useProject(): ProjectState {
  return useContextSafely(Project);
}

export function useProjectInfo(): ProjectInfo {
  return useContextSafely(ProjectInfo);
}

export function useProjectList(): ProjectInfo[] {
  return useContextSafely(ProjectList);
}

export function useSimulationOptions(): SimulationOptions {
  return useContextSafely(Sim);
}

export function useViewState(): ViewState {
  return useContextSafely(View);
}

export function useSources(): (Source | Generator)[] {
  return useContextSafely(Sources);
}

export function useGuides(): Guide[] {
  return useContextSafely(Guides);
}

export function useVariables(): LocalVariableMap {
  return useContextSafely(Vars);
}

export function useGlobals(): VariableMap {
  return useContextSafely(Globals);
}

export const StateProvider: FC<Children> = ({ children }) => {
  const [project, dispatch] = useReducer(dispatchAction, undefined, loadLastProject);

  return (
    <Dispatch.Provider value={dispatch}>
      <Project.Provider value={project}>
        <ProjectInfo.Provider value={project}>
          <ProjectList.Provider value={getProjectList()}>
            <View.Provider value={project.view}>
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
            </View.Provider>
          </ProjectList.Provider>
        </ProjectInfo.Provider>
      </Project.Provider>
    </Dispatch.Provider>
  );
};
