import Heading from "@/components/ui/Heading/Heading";
import { useAuthStore } from "@/store/authStore";
import styles from "./GreetingHeading.module.scss";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "בוקר טוב";
  if (hour >= 12 && hour < 18) return "צהריים טובים";
  if (hour >= 18 && hour < 21) return "ערב טוב";
  return "לילה טוב";
}

export default function GreetingHeading() {
  const givenName = useAuthStore((s) => s.user?.firstName);
  if (!givenName) return null;

  return (
    <div className={styles.wrapper}>
      <Heading level="h1">{`${getGreeting()}, ${givenName}`}</Heading>
    </div>
  );
}
