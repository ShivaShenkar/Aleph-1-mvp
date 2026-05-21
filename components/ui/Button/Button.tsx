import styles from "./Button.module.scss";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
  text: string;
  disabled?: boolean;
  className?: string;
}

export default function Button({ variant = "primary", size = "md", text, disabled, className }: ButtonProps) {
  const classNames = [styles.button, styles[variant], styles[size], disabled ? styles.disabled : "", className].filter(Boolean).join(" ");
  return <button className={classNames} disabled={disabled}>{text}</button>;
}
