import type { DataItem } from "@/at-shared";
import { useCallback, useState } from "react";
import { useAppStore } from "../../../../store";
import Dropdown from "../../../Dropdown";

export const allValue = 'all';
const optionAll = { value: allValue, label: 'All' };


const SearchForm = () => {
  const [color, setColor] = useState(allValue);
  const { items, filtered, actions } = useAppStore();

  const colors = [...new Set(items.map((item) => item.color))];
  const options = [optionAll, ...colors.map((color) => ({ value: color || '', label: color || '' }))];

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const value = e.target.value;
    setColor(() => value);

    if (value === allValue) {
      actions.filter.clear();
    } else {
      const predicat = (item: DataItem) => item.color === value;
      actions.filter.set(predicat);
    }
  }, []);

  return (
    <div>
      <h2>Filter</h2>
      <Dropdown options={options} label="Colors:" value={color} onChange={onChange} />
      {color !== allValue && (<><div><b>Filtered: </b><span>{filtered}</span></div></>)}
    </div>
  );
};

export default SearchForm;
