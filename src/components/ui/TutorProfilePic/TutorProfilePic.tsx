import { useState, useEffect, useRef } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "./TutorProfilePic.module.scss";

interface TutorProfilePicProps {
  tutorId: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export default function TutorProfilePic({
  tutorId,
  firstName,
  lastName,
  size = 3,
}: TutorProfilePicProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken;
        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_GATEWAY_URL}/fetch-profile-pic?id=${tutorId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!res.ok) {
          if (!cancelled) setFailed(true);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        if (!cancelled) setImgSrc(url);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [tutorId]);

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;

  return (
    <div className={styles.wrapper} style={{ width: `${size}rem`, height: `${size}rem` }}>
      {!failed && imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          className={styles.img}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.initials}>{initials || "מ"}</span>
      )}
    </div>
  );
}
