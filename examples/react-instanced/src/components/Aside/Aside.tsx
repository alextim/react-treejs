import SearchForm from './components/SearchForm';
import AddForm from './components/AddForm';
import ItemsCount from './components/ItemsCount';
import SelectedItemInfo from './components/SelectedItemInfo';

const Aside = () => (
  <>
    <ItemsCount />
    <hr />
    <SelectedItemInfo />
    <hr />
    <AddForm />
    <hr />
    <SearchForm />
  </>
);


export default Aside;
