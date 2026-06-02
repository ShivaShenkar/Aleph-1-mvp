import styles from "./Heading.module.scss";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps {
  level?: HeadingLevel;
  underline?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Heading({
  level="h1",
  underline = false,
  children,
  className = "",
}: HeadingProps) {
  const Tag = level;

  const classNames = [
    styles.heading,
    styles[Tag],
    underline ? styles.underline : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classNames}>{children}</Tag>;
}
