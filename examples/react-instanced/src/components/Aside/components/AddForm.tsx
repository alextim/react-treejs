import { useCallback } from 'react';
import { useAppStore } from '../../../store';

const AddForm = () => {
  const actions = useAppStore(({ actions }) => actions);
  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    actions.add();
    // boxesRef.current?.updateLast();
  }, []);
  return (
    <div>
      <h3>Add new item</h3>
      <button onClick={onClick}>Add</button>
    </div>
  );
};

export default AddForm;
