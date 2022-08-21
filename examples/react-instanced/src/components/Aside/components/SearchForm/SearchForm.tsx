import type { DataItem } from '@/at-shared';
import { useCallback, useMemo, useState } from 'react';
import { useAppStore } from '@/store';
import Dropdown from '@/components/Dropdown';

export const allValue = 'all';
const optionAll = { value: allValue, label: 'All' };


const SearchForm = () => {
  const [color, setColor] = useState(allValue);

  const items = useAppStore(({ items }) => items);
  const filtered = useAppStore(({ filtered }) => filtered);
  const filter = useAppStore(({ filter }) => filter);

  const options = useMemo(() => {
    const colors = [...new Set(items.map((item) => item.color))];
    return [optionAll, ...colors.map((color) => ({ value: color || '', label: color || '' }))];
  }, []);

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const value = e.target.value;
    setColor(() => value);

    if (value === allValue) {
      filter.clear();
    } else {
      const predicat = (item: DataItem) => item.color === value;
      filter.set(predicat);
    }
  }, []);

  return (
    <div>
      <h3>Filter</h3>
      <Dropdown options={options} label="Colors:" value={color} onChange={onChange} />
      {color !== allValue && (<><div><b>Filtered: </b><span>{filtered}</span></div></>)}
    </div>
  );
};

export default SearchForm;
