import Image from "next/image";
import Link from "next/link";
import styles from "./Card.module.scss";
import DefaultAvatar from "../DefaultAvatar/DefaultAvatar";

interface CardProps {
  title: string;
  text?: string;
  image?: string;
  width?: string;
  height?: string;
  href?: string;
  hover?: boolean;
  className?: string;
}

export default function Card({
  title,
  text,
  image,
  width = "24.8rem",
  height = "27.25rem",
  href,
  hover = false,
  className="",
}: CardProps) {
  const avatarSize = text ? "5rem" : "11.5625rem";

  const content = (
      <div className={`${styles.card}${hover ? ` ${styles.hoverable}` : ""}${className}`} style={{ width, height }}>
      <div className={styles.imageArea}>
        <div
          className={styles.avatarWrapper}
          style={{ width: avatarSize, height: avatarSize }}
        >
          {image ? (
            <Image src={image} alt="" fill />
          ) : (
            <DefaultAvatar
              size={avatarSize}
              label={text ? "לוגו" : "גרפיקה\nעיצוב"}
            />
          )}
        </div>
      </div>
      <div className={styles.contentArea}>
        <h4 className={styles.title}>{title}</h4>
        {text && <p className={styles.body}>{text}</p>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>{content}</Link>;
  }

  return content;
}
