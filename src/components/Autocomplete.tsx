import React, { useEffect, useRef, useState } from 'react';

type AutocompleteProps = React.HTMLProps<HTMLInputElement> & {
  options: string[];
};

const Autocomplete: React.FC<AutocompleteProps> = ({ options, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [valueEnd, setValueEnd] = useState('');
  const [candidate, setCandidate] = useState<string>();
  const [backspace, setBackspace] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setBackspace(e.key === 'Backspace');
    props.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  useEffect(() => {
    setValue(props.value as string);
  }, [props.value]);

  useEffect(() => {
    if (backspace || value.length === 0) {
      setCandidate(undefined);
    } else {
      setCandidate(options.filter(opt => opt.startsWith(value))[0]);
    }
  }, [value, backspace, options]);

  useEffect(() => {
    if (candidate) {
      setValueEnd(candidate.slice(value.length));
    } else {
      setValueEnd('');
    }
  }, [candidate, value]);

  useEffect(() => {
    ref.current?.setSelectionRange(value.length, value.length + valueEnd.length, 'backward');
  }, [value, valueEnd]);

  return (
    <input
      ref={ref}
      {...props}
      value={value + valueEnd}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
    />
  );
};

export default Autocomplete;
