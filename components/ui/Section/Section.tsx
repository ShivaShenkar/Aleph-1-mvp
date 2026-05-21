import styles from "./Section.module.scss";
import { ReactNode } from "react"

interface SectionProps {
    children: ReactNode
    className?: string
}
export default function Section({children, className}: SectionProps) {
    return <section className={`${styles.section} ${className || ''}`}>{children}</section>
}