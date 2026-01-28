import React from "react";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  id,
  ...props
}) => {
  return (
    <label htmlFor={id} className="relative block w-full">
      <input
        id={id}
        className="peer w-full rounded border-green-500/30 bg-black px-3 py-2 text-sm text-white shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        {...props}
        placeholder=" " // Required for the peer-placeholder-shown to work
      />
      <span className="absolute start-3 top-2 -translate-y-5 scale-75 bg-black px-1 text-sm font-medium text-green-500/80 transition-transform peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-green-500">
        {label}
      </span>
    </label>
  );
};

export default FloatingLabelInput;
