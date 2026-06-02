import styles from "./Link.module.scss";

interface LinkProps {
  href?: string;
  text: string;
  target?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Link({ href = "#", text, target, onClick }: LinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={styles.link}
      onClick={onClick}
    >
      {text}
    </a>
  );
}
