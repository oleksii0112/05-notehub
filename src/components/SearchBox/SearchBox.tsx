import css from "./SearchBox.module.css"


interface SearchBoxProps {
  query: string;
  onChange: (value:string) => void;
}


export default function SearchBox({ query, onChange }: SearchBoxProps) {
  
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={query}
      onChange={handleQueryChange}
    />
  );
}