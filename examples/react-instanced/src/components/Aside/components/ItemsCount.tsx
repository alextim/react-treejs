import { useAppStore } from '../../../store';

const Count = () => {
  const { items } = useAppStore();
  return (
    <span>{items.length}</span>
  );
};


const ItemsCount = () => (
  <div><b>Items count: </b><Count /></div>
);


export default ItemsCount;
