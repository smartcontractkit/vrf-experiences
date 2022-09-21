import React from "react";
import "./TextInput.css";

interface TextInputProps {
  value: string | undefined;
  placeholder?: string;
  onChange: Function;
}

export default function TextInput(props: TextInputProps) {
  return (
    <input className="text-input" type="text" placeholder={props.placeholder} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
  );
}
