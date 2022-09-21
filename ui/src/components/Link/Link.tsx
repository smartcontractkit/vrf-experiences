import React from "react";
import "./Link.css";

interface LinkProps {
  text: string;
  url: string;
}

export default function Link(props: LinkProps) {
  return (
    <a href={props.url}>
      <button className="link">{props.text}</button>
    </a>
  );
}
