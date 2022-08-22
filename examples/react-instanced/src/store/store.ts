import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import type { DataItem, Point2D  } from '@/at-shared';
import type { ZustandDevtools } from '.';

import { getRandomPaletteColorName, BOX_SIZE, BLOCK_X_GAP } from '@/at-shared';

type AppState = {
  items: DataItem[];
  lines: Point2D[];

  progressIndicator: number;
  linesLoading: boolean;
  itemsLoading: boolean;
  error: any;

  added: number;
  filtered: number;
  selectedInstanceId: number | undefined;
};

type Actions = {
  loadItems: () => void;
  loadLines: () => void;
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

  progressIndicator: 0,
  itemsLoading: false,

  linesLoading: false,
  error: null,

  added: 0,
  filtered: 0,
  selectedInstanceId: undefined,
};

const fetchApi = async (url: string) => {
  const resp = await fetch(url);
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err);
  }

  const result = await resp.json();

  return result;
};

const useAppStore = create<Store, ZustandDevtools>(
  devtools((set) => ({
    ...initialState,

    async loadItems() {
      set(() => ({ itemsLoading: true, progressIndicator: 0 }));
      try {
        const { count: itemsCount } = await fetchApi(import.meta.env.VITE_ITEM_COUNT_API);
        const limit = parseInt(import.meta.env.VITE_ITEM_LIMIT);
        const urls: string[] = [];
        for (let offset = 0; offset < itemsCount + limit; offset += limit) {
          const url = `${import.meta.env.VITE_ITEM_API}?limit=${limit}&offset=${offset}`;
          urls.push(url);
        }

        const n = urls.length;
        const chunks = await Promise.all(urls.map(async (url, i) => {

          const chunk = await fetchApi(url);
          set(() => ({ progressIndicator: i / n }));
          return chunk;

        }));

        const items = chunks.flat();

        set(() => ({ items }));
      } catch (err: any) {
        set({ error: err.toString() })
      } finally {
        set(() => ({ itemsLoading: false, progressIndicator: 0 }));
      }
    },

    async loadLines() {
      set(() => ({ linesLoading: true }));
      try {
        const resp = await fetch(import.meta.env.VITE_LINE_API);
        if (!resp.ok) {
          const err = await resp.text();
          throw new Error(err);
        }
        const lines = await resp.json();
        set(() => ({ lines }));
      } catch (err: any) {
        set({ error: err.toString() })
      } finally {
        set(() => ({ linesLoading: false }));
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
