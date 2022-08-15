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
};

type Actions = {
  actions: {
    load: () => void;
    add: () => void;
    remove: (id: number) => void;
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
        remove: (id: number) => set((state) => {
          state.items.splice(id, 1);
          return { items: [...state.items] };
        }),
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
            for(const item of state.items) {
              let hidden: boolean;
              if (predicat(item)) {
                filtered += 1;
                hidden = false;
              } else {
                hidden = true;
              }
              items.push({ ...item, hidden });
            }
            return { items, filtered };
          }),
        },
      },
    };
  }),
);
