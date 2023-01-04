import { createContext, Dispatch, FC, useContext, useReducer } from 'react';
import { Children } from '../types';
import { Action } from './actions';
import { dispatchAction } from './reducer';
import { AreaConfig, Guide, Project, SimulationOptions, Source, VariableMap } from './types';

function createProject(): Project {
  return {
    area: {
      width: 140,
      depth: 100,
      x0: 70,
      y0: 25,
      scale: 6,
      orientation: 'portrait',
    },
    simulation: {
      frequency: 60,
      resolution: 4,
    },
    sources: [],
    guides: [],
    globals: {
      $c: {
        min: 300,
        max: 400,
        value: 343,
      },
    },
    variables: {},
  };
}

const Dispatch = createContext<Dispatch<Action>>(undefined as any);
const Area = createContext<AreaConfig>(undefined as any);
const Sim = createContext<SimulationOptions>(undefined as any);
const Sources = createContext<Source[]>(undefined as any);
const Guides = createContext<Guide[]>(undefined as any);
const Globals = createContext<VariableMap>(undefined as any);
const Vars = createContext<VariableMap>(undefined as any);

export function useDispatch(): Dispatch<Action> {
  return useContext(Dispatch);
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
  const [project, dispatch] = useReducer(dispatchAction, undefined, createProject);

  return (
    <Dispatch.Provider value={dispatch}>
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
    </Dispatch.Provider>
  );
};
