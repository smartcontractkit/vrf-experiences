import React from "react";
import "./Paragraph.css";

interface ParagraphProps {
  text: string;
}

export default function Paragraph(props: ParagraphProps) {
  return <h3 className="paragraph">{props.text}</h3>;
}
