import { create } from "zustand";
// import type { StateStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { getItem, setItem, deleteItem } from "./indexDB/indexDBStorage";
import type { PersistStorage } from "zustand/middleware";

export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  isDefault?: boolean;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;

  // Actions
  addWorkspace: (name: string) => void;
  editWorkspace: (id: string, name: string) => void;
  deleteWorkspace: (id: string) => void;
  setCurrentWorkspace: (workspace: Workspace) => void;
  initializeDefaultWorkspace: () => void;
}

// Custom IndexedDB storage implementation for zustand persist middleware
// persist middleware needs an object with getItem, setItem, removeItem methods for any storage implementation
// like localStorage, sessionStorage or custom storage like IndexedDB
const indexedDBStorage: PersistStorage<WorkspaceState> = {
  // this function is called by zustand persist middleware to get the data from IndexedDB
  // we use the getItem , setItem, deleteItem functions defined in indexDBStorage.ts which interacts with IndexedDB

  // Custom storage implementation for IndexedDB
  getItem: async (name) => {
    const value = await getItem<string>(name);
    if (!value) return null;
    const parsed = JSON.parse(value);

    // Convert Date strings back to Date objects
    if (parsed.state?.workspaces) {
      parsed.state.workspaces = parsed.state.workspaces.map((ws: any) => ({
        ...ws,
        createdAt: new Date(ws.createdAt),
      }));
    }
    if (parsed.state?.currentWorkspace?.createdAt) {
      parsed.state.currentWorkspace.createdAt = new Date(
        parsed.state.currentWorkspace.createdAt
      );
    }

    // returns parse because while setting we stringify the value
    return parsed;
  },
  setItem: async (name, value) => {
    // stringify the value before storing because IndexedDB works with strings
    await setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    // delete the item from IndexedDB store
    await deleteItem(name);
  },
};

const useWorkspaceStore = create<WorkspaceState>()(
  // persist middleware want an object with getItem, setItem, removeItem methods for custom storage
  // persit take ({}) object for state and actions and {} configuration object for storage and name
  // ({}) is object literal which only return object of state and actions as 1st argument
  // persist is higher order function which takes function which returns object of state and actions as 1st argument
  persist(
    // this is a function which returns object of state and actions
    (set, get) => ({
      workspaces: [],
      currentWorkspace: null,

      addWorkspace: (name: string) => {
        const newWorkspace: Workspace = {
          id: `workspace_${Date.now()}`,
          name,
          createdAt: new Date(),
          isDefault: false,
        };
        set({ workspaces: [...get().workspaces, newWorkspace] });
      },

      editWorkspace: (id: string, name: string) => {
        set({
          workspaces: get().workspaces.map((ws) =>
            ws.id === id ? { ...ws, name } : ws
          ),
        });

        // Update current workspace if it's being edited
        if (get().currentWorkspace?.id === id) {
          set({ currentWorkspace: { ...get().currentWorkspace!, name } });
        }
      },

      deleteWorkspace: (id: string) => {
        const workspace = get().workspaces.find((ws) => ws.id === id);

        // Don't delete default workspace
        if (workspace?.isDefault) {
          return;
        }

        set({ workspaces: get().workspaces.filter((ws) => ws.id !== id) });

        // If deleted workspace was current, switch to default
        if (get().currentWorkspace?.id === id) {
          const defaultWorkspace = get().workspaces.find((ws) => ws.isDefault);
          if (defaultWorkspace) {
            set({ currentWorkspace: defaultWorkspace });
          }
        }
      },

      setCurrentWorkspace: (workspace: Workspace) => {
        set({ currentWorkspace: workspace });
      },

      initializeDefaultWorkspace: () => {
        const existingDefault = get().workspaces.find((ws) => ws.isDefault);

        if (!existingDefault) {
          const defaultWorkspace: Workspace = {
            id: "workspace_default",
            name: "Personal",
            createdAt: new Date(),
            isDefault: true,
          };

          set({
            workspaces: [defaultWorkspace],
            currentWorkspace: defaultWorkspace,
          });
        } else if (!get().currentWorkspace) {
          set({ currentWorkspace: existingDefault });
        }
      },
    }),

    // Persist configuration
    // persist wants a storage object with getItem, setItem, removeItem methods
    {
      name: "workspace-storage",
      storage: indexedDBStorage,
    }
  )
);

export default useWorkspaceStore;
