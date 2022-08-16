import { DataItem, Point3D } from '@/at-shared';
import { useCallback } from 'react';
import { useAppStore } from '../../../store';

const SelectedItemInfo = () => {
  const { items, selectedInstanceId } = useAppStore();
  const actions = useAppStore(({ actions }) => actions);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    if (selectedInstanceId !== undefined) {
      actions.remove(selectedInstanceId);
      // boxesRef.current?.updateLast();
    }
  }, [selectedInstanceId]);

  const { id, pos: [x, y, z], color } = selectedInstanceId !== undefined ? items[selectedInstanceId] : ({id: '', pos: ['', '', ''] as any as Point3D, color: ''} as DataItem);
  return (
    <div>
      <h2>Selected Item</h2>
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
