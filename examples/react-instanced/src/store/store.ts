import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import type { DataItem, Point2D  } from '@/at-shared';
import type { ZustandDevtools } from '.';

import { getRandomPaletteColorName, BOX_SIZE, BLOCK_X_GAP } from '@/at-shared';

type AppState = {
  items: DataItem[];
  lines: Point2D[];

  loading: boolean;
  error: any;

  added: number;
  filtered: number;
  selectedInstanceId: number | undefined;
};

type Actions = {
  loadAsync: () => void;
  add: () => void;
  remove: (instanceId: number) => void;
  selection: {
    set: (instanceId: number) => void,
    toggle: (instanceId: number | undefined) => void,
    clear: () => void,
  },
  filter: {
    clear: () => void;
    set: (predicat: (item: DataItem) => boolean) => void;
  },
};

type Store = AppState & Actions;

const initialState: AppState = {
  items: [],
  lines: [],

  loading: false,
  error: null,

  added: 0,
  filtered: 0,
  selectedInstanceId: undefined,
};

const useAppStore = create<Store, ZustandDevtools>(
  devtools((set) => ({
    ...initialState,

    async loadAsync() {
      set(() => ({ loading: true }));
      try {
        const urls = [
          import.meta.env.VITE_ITEMS_API,
          import.meta.env.VITE_LINES_API,
        ];
        const [items, lines] = await Promise.all(urls.map(async (url) => {
          const resp = await fetch(url);
          if (!resp.ok) {
            const err = await resp.text();
            throw new Error(err)
          }
          const result = await resp.json();
          return result;
        }));
        set(() => ({ items, lines }));
      } catch (err: any) {
        set({ error: err.toString() })
      } finally {
        set(() => ({ loading: false }));
      }
    },

    add: () => set((state) => {
      const shift = state.added + BLOCK_X_GAP;
      const newItem: DataItem = {
        id: nanoid(),
        pos: [BOX_SIZE, BOX_SIZE * shift, BOX_SIZE],
        color: getRandomPaletteColorName(),
      };
      return { items: [...state.items, newItem], added: state.added + 1 };
    }),

    remove: (instanceId: number) => set((state) => {
      const selectedInstanceId = instanceId === state.selectedInstanceId ? undefined : state.selectedInstanceId;
      state.items.splice(instanceId, 1);
      return { items: [...state.items], selectedInstanceId  };
    }),

    selection: {
      set: (instanceId: number | undefined) => set(() => ({ selectedInstanceId: instanceId })),

      toggle: (instanceId: number | undefined) => set((state) => {
        if (instanceId === undefined) {
          return { selectedInstanceId: undefined };
        }
        if (state.selectedInstanceId !== instanceId) {
          return { selectedInstanceId: instanceId };
        }
        return { selectedInstanceId: state.selectedInstanceId === undefined ? instanceId : undefined };
      }),
      clear: () => set(() => ({ selectedInstanceId: undefined })),
    },

    filter: {
      clear: () => set((state) => {
        return {
          items: state.items.map((item) => ({ ...item, hidden: false })),
          filtered: state.items.length,
        };
      }),

      set: (predicat: (item: DataItem) => boolean) => set((state) => {
        const items: DataItem[] = [];
        let filtered = 0;
        let i = 0;
        let found = false;
        for (const item of state.items) {
          let hidden: boolean;
          if (predicat(item)) {
            filtered += 1;
            hidden = false;
            if (state.selectedInstanceId === i) {
              found = true;
            }
          } else {
            hidden = true;
          }

          items.push({ ...item, hidden });
          i++;
        }
        return { items, filtered, selectedInstanceId: found ? state.selectedInstanceId : undefined };
      }),
    },
  })));

export { useAppStore };
