import { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import type { DataItem } from '@/at-shared';
import { useAppStore } from '@/store';

const formatFloat = (n: number) => n.toFixed(2);
const formatPos = ({ pos: [x, y, z] }: DataItem) => `${formatFloat(x)}, ${formatFloat(y)}, ${formatFloat(z)}`;

type ListItem = {
  instanceId: number;
  item: DataItem;
};

const ItemList = () => {
  const items = useAppStore(({ items }) => items);
  const selectedInstanceId = useAppStore(({ selectedInstanceId }) => selectedInstanceId);
  const selection = useAppStore(({ selection }) => selection);

  const filteredItems: ListItem[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!items[i].hidden) {
      filteredItems.push({ instanceId: i, item: items[i] })
    }
  }

  const dblClickHandler: React.MouseEventHandler<HTMLElement> = useCallback((e) => {
    e.preventDefault();
    let el = e.target as HTMLElement;
    if (!el.className.startsWith('vl_r')) {
      el = el.parentElement!;
    }
    const attr = el.getAttribute('data-id');
    const instanceId = attr ? parseInt(attr) : undefined;
    // console.log(instanceId)
    selection.toggle(instanceId);
  }, []);

  const Row = ({ data, index, style }: { data: ListItem[], index: number, style: any }) => {
    const { instanceId, item } = data[index];
    return (
      <li data-id={instanceId} className={`vl_r${index % 2 ? '' : ' vl_r-0'}${selectedInstanceId === instanceId ?  ' vl_r-active' : ''}`} style={style} onDoubleClick={dblClickHandler}>
        <div>{index}</div><div>{instanceId}</div><div>{formatPos(item)}</div>
      </li>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          innerElementType="ul"
          className="vl"
          itemCount={filteredItems.length}
          itemSize={35}
          width={width}
          height={height}
          itemData={filteredItems}
        >
          {Row }
        </List>
      )}
    </AutoSizer>
  );
};
export default ItemList;
