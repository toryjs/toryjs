import { UndoManager } from 'mst-middlewares';
import { DataSet } from './form_store';

export let initUndoManager = (managedDataset: DataSet<any>) => {
  const manager = managedDataset.history;
  return {
    undo: () => {
      manager && manager.canUndo && manager.undo();
    },
    redo: () => {
      manager && manager.canRedo && manager.redo();
    }
  };
};
// export const setUndoManager = (targetStore: any) => {
//   undoManager.manager = targetStore.history;
//   return {};
// };
