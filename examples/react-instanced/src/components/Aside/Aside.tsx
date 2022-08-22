import SearchForm from './components/SearchForm';
import AddForm from './components/AddForm';
import ItemsCount from './components/ItemsCount';
import SelectedItemInfo from './components/SelectedItemInfo';
import List from './components/List';

import { useAppStore } from '@/store';

const Aside = () => {
  const itemsLoading = useAppStore(({ itemsLoading }) => itemsLoading);
  if (itemsLoading) {
    return null; 
  }
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0, right: 0,
      }}>
        <div style={{
          display: 'grid', gap: '0.75rem',
          flex: '0 0 auto',
        }}>
          <ItemsCount />
          <hr />
          <SelectedItemInfo />
          <hr />
          <AddForm />
          <hr />
          <SearchForm />
        </div>
        <div style={{
          flex: '1 1 auto',
          overflow: 'hidden',
        }}>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Aside;
