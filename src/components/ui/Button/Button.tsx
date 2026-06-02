import { useNavigate } from "react-router-dom";
import styles from "./Button.module.scss";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
  text: string;
  disabled?: boolean;
  className?: string;
  redirect?: string;
}

export default function Button({ variant = "primary", size = "md", text, disabled, className, redirect }: ButtonProps) {
  const navigate = useNavigate();
  const classNames = [styles.button, styles[variant], styles[size], disabled ? styles.disabled : "", className].filter(Boolean).join(" ");
  
  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={redirect ? () => navigate(redirect) : undefined}
    >
      {text}
    </button>
  );
}