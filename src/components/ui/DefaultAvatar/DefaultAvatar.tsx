import styles from "./DefaultAvatar.module.scss";

interface DefaultAvatarProps {
  size?: string;
  label?: string;
}

export default function DefaultAvatar({ size = "5rem", label }: DefaultAvatarProps) {
  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg viewBox="0 0 185 185" fill="#E5E7EB">
        <circle cx="92.5" cy="92.5" r="92.5" />
      </svg>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
