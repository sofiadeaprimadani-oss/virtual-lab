import { createContext, useContext } from 'react';
import { TerminalDef } from '../simulation/terminals';

export interface TerminalContextValue {
  terminalWireCount: Record<string, number>;
  selectedTerminalId: string | null;
  onTerminalClick: (terminal: TerminalDef) => void;
}

export const TerminalContext = createContext<TerminalContextValue>({
  terminalWireCount: {},
  selectedTerminalId: null,
  onTerminalClick: () => {},
});

export const useTerminalContext = () => useContext(TerminalContext);
