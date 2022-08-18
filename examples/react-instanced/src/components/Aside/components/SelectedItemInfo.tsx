import { useCallback } from 'react';

import { DataItem, Point3D } from '@/at-shared';
import { useAppStore } from '@/store';

const SelectedItemInfo = () => {
  const items = useAppStore(({ items }) => items);
  const selectedInstanceId = useAppStore(({ selectedInstanceId }) => selectedInstanceId);
  const remove = useAppStore(({ remove }) => remove);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    if (selectedInstanceId !== undefined) {
      remove(selectedInstanceId);
      // boxesRef.current?.updateLast();
    }
  }, [selectedInstanceId]);

  const { id, pos: [x, y, z], color } = selectedInstanceId !== undefined ? items[selectedInstanceId] : ({id: '', pos: ['', '', ''] as any as Point3D, color: ''} as DataItem);
  return (
    <div>
      <h3>Selected Item</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem'}}>
        <b>Instance Id:</b><div>{selectedInstanceId}</div>
        <b>Item Id:</b><div>{id}</div>
        <b>x:</b><div>{x}</div>
        <b>y:</b><div>{y}</div>
        <b>z:</b><div>{z}</div>
        <b>Color:</b><div>{color}</div>
      </div>
      <button disabled={selectedInstanceId === undefined} onClick={onClick}>Delete</button>
    </div>
  );
};

export default SelectedItemInfo;
