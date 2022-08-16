import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { nanoid } from 'nanoid';

import type { DataItem  } from '@/at-shared';
import type { ZustandDevtools } from '.';

import { generateItemsData, getRandomPaletteColorName, BOX_SIZE, BLOCK_X_GAP } from '@/at-shared';

type State = {
  items: DataItem[];
  added: number;
  filtered: number;
  selectedInstanceId: number | undefined;
};

type Actions = {
  actions: {
    load: () => void;
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
  },
};


export const useAppStore = create<State & Actions, ZustandDevtools >(
  devtools(function (set) {
    return {
      items: [],
      added: 0,
      filtered: 0,
      selectedInstanceId: undefined,

      actions: {
        load: () => set(() => {
          const data = generateItemsData();
          return { items: data, filtered: data.length };
        }),

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
            for(const item of state.items) {
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
      },
    };
  }),
);
