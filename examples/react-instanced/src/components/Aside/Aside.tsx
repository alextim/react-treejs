import { useCallback } from 'react';
import { useAppStore } from '../../store';
import SearchForm from '../SearchForm';

const Count = () => {
  const { items } = useAppStore();
  return (
    <span>{items.length}</span>
  );
};

const Aside = () => {
  const actions = useAppStore(({ actions }) => actions);
  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    actions.add();
    // boxesRef.current?.updateLast();
  }, []);

  return (
    <>
      <button onClick={onClick}>add</button>
      <div><span>Total: </span><Count /></div>
      <SearchForm />
    </>
  );
};

export default Aside;
