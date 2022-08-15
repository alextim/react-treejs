type Props = {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;

};
const Dropdown = ({ label, value, options, onChange }: Props) => {
  return (
    <label>
      {label}
      <select value={value} onChange={onChange}>
        {options.map((option, i) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};

export default Dropdown;
