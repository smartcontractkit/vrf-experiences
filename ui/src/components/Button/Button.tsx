import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  onClick: Function;
  onClickParams?: any;
  isDisabled?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <button className="_2022-btn" onClick={() => props.onClick(props.onClickParams)} disabled={props.isDisabled}>
      <span className="._2022-btn-label">{props.text}</span>
    </button>
  );
}
