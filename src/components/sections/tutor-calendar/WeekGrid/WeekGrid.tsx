import { useMemo, useState, useCallback, useEffect } from "react";
import type { CSSProperties } from "react";
import type { LessonType } from "@/models/models";
import type { CalendarBlock } from "@/types/calendar";
import BookingBlock from "../BookingBlock/BookingBlock";
import LessonTypeTooltip from "../LessonTypeTooltip/LessonTypeTooltip";
import SubjectTooltip from "../SubjectTooltip/SubjectTooltip";
import styles from "./WeekGrid.module.scss";

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const START_HOUR = 6;
const END_HOUR = 23;
const ROW_HEIGHT = 44;
const HEADER_HEIGHT = 48;

interface WeekGridProps {
  weekStart: Date;
  lessonTypes: LessonType[];
  subjects: string[];
  blocks: CalendarBlock[];
  onAddBlock: (lt: LessonType, day: number, startHour: number) => void;
  onUpdateBlock: (blockId: string, updates: Partial<CalendarBlock>) => void;
  onDeleteBlock: (blockId: string, source: "saved" | "new") => void;
}

function buildSlots(): { label: string; index: number }[] {
  const slots: { label: string; index: number }[] = [];
  for (let i = START_HOUR * 2; i <= END_HOUR * 2; i++) {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    slots.push({ label: `${String(h).padStart(2, "0")}:${m}`, index: i });
  }
  return slots;
}

const SLOTS = buildSlots();

function getBlockStyle(block: CalendarBlock): CSSProperties {
  const rowOffset = block.startHour - START_HOUR * 2;
  const durationRows = block.endHour - block.startHour;
  const d = block.day - 1;
  return {
    top: rowOffset * ROW_HEIGHT + HEADER_HEIGHT + 1,
    left: `calc(100% - 56px - ${d + 1} * (100% - 56px) / 7 + 6px)`,
    width: `calc((100% - 56px) / 7 - 12px)`,
    height: durationRows * ROW_HEIGHT - 3,
  };
}

export default function WeekGrid({
  weekStart,
  lessonTypes,
  subjects,
  blocks,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
}: WeekGridProps) {
  const [tooltipData, setTooltipData] = useState<{
    style: CSSProperties;
    day: number;
    hour: number;
  } | null>(null);

  const [overlapBlocks, setOverlapBlocks] = useState<CalendarBlock[]>([]);
  const [fadingBlockIds, setFadingBlockIds] = useState<string[]>([]);
  const [subjectPopupForBlock, setSubjectPopupForBlock] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    blockId: string;
    source: "saved" | "new";
  } | null>(null);

  useEffect(() => {
    setTooltipData(null);
  }, [weekStart]);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [weekStart]);

  function isPastSlot(day: number, hour: number): boolean {
    const now = new Date();
    const slotDate = new Date(weekStart);
    slotDate.setDate(slotDate.getDate() + (day - 1));
    const hourInt = Math.floor(hour);
    const minute = (hour % 1) === 0.5 ? 30 : 0;
    slotDate.setHours(hourInt, minute, 0, 0);
    return slotDate.getTime() < now.getTime();
  }

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const dayStr = target.dataset.day;
    const hourStr = target.dataset.hour;
    if (dayStr === undefined || hourStr === undefined) {
      setTooltipData(null);
      return;
    }
    const day = Number(dayStr);
    const hour = Number(hourStr);
    if (isPastSlot(day, hour)) return;
    const d = day - 1;
    const rowOffset = hour * 2 - START_HOUR * 2;
    const top = rowOffset * ROW_HEIGHT + HEADER_HEIGHT + 1 + ROW_HEIGHT / 2;
    const left = `calc(100% - 56px - ${d+0.05} * (100% - 56px) / 7 + 10px)`;
    setTooltipData({ style: { top, left }, day, hour });
  }

  const handleLessonSelect = useCallback(
    (lt: LessonType, day: number, hour: number) => {
      if (isPastSlot(day, hour)) return;
      const startHour = hour * 2;
      const endHour = startHour + Math.ceil(lt.durationMinutes / 30);

      const overlapping = blocks.some(
        (b) =>
          b.day === day &&
          !fadingBlockIds.includes(b.id) &&
          b.startHour < endHour &&
          startHour < b.endHour,
      );

      if (overlapping) {
        const tempBlock: CalendarBlock = {
          id: crypto.randomUUID(),
          source: "new",
          weekStart: "",
          day,
          startHour,
          endHour,
          title: lt.title,
          price: lt.price,
          durationMinutes: lt.durationMinutes,
          location: lt.location,
          subject: null,
        };
        setOverlapBlocks([tempBlock]);
        setTooltipData(null);
        setTimeout(() => setOverlapBlocks([]), 600);
        return;
      }

      onAddBlock(lt, day, startHour);
      setTooltipData(null);
    },
    [blocks, fadingBlockIds, onAddBlock],
  );

  function handleRequestDelete(blockId: string, source: "saved" | "new") {
    setDeleteTarget({ blockId, source });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { blockId, source } = deleteTarget;
    setDeleteTarget(null);
    setFadingBlockIds((prev) => [...prev, blockId]);
    setTimeout(() => {
      onDeleteBlock(blockId, source);
      setFadingBlockIds((prev) => prev.filter((id) => id !== blockId));
    }, 500);
  }

  function handleSubjectClick(blockId: string) {
    setSubjectPopupForBlock(blockId);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* Corner + headers */}
        <div className={styles.corner} />
        {weekDates.map((d, i) => (
          <div key={i} className={styles.headerCell}>
            <span className={styles.headerDay}>{DAY_NAMES[i]}</span>
            <span className={styles.headerDate}>
              {d.getDate()}.{d.getMonth() + 1}
            </span>
          </div>
        ))}

        {/* Hour rows */}
        <div className={styles.slotsWrapper} onClick={handleGridClick}>
          {SLOTS.map((slot) => (
            <div key={slot.index} className={styles.rowWrapper}>
              <div className={styles.hourLabel}>{slot.label}</div>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div
                  key={`${slot.index}-${day}`}
                  className={`${styles.cell} ${isPastSlot(day + 1, slot.index / 2) ? styles.cellPast : ""}`}
                  data-day={day + 1}
                  data-hour={slot.index / 2}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Blocks layer */}
        <div className={styles.blocksLayer}>
          {blocks.map((block) => (
            <BookingBlock
              key={block.id}
              block={block}
              style={getBlockStyle(block)}
              fading={fadingBlockIds.includes(block.id)}
              onSubjectClick={handleSubjectClick}
              onBlockClick={handleRequestDelete}
            />
          ))}
          {overlapBlocks.map((block) => (
            <BookingBlock
              key={block.id}
              block={block}
              style={getBlockStyle(block)}
              fading
              onSubjectClick={() => {}}
              onBlockClick={() => {}}
            />
          ))}
        </div>

        {/* Lesson type tooltip */}
        {tooltipData && (
          <LessonTypeTooltip
            style={tooltipData.style}
            lessonTypes={lessonTypes}
            onSelect={(lt) =>
              handleLessonSelect(lt, tooltipData.day, tooltipData.hour)
            }
          />
        )}

        {/* Subject tooltip */}
        {subjectPopupForBlock && (
          <SubjectTooltip
            tutorSubjects={subjects}
            onSelect={(subject) => {
              onUpdateBlock(subjectPopupForBlock, { subject });
              setSubjectPopupForBlock(null);
            }}
            onClose={() => setSubjectPopupForBlock(null)}
          />
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div
            className={styles.overlay}
            onClick={() => setDeleteTarget(null)}
          >
            <div
              className={styles.dialog}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.dialogText}>למחוק את השיעור?</p>
              <div className={styles.dialogActions}>
                <button
                  className={styles.dialogCancel}
                  onClick={() => setDeleteTarget(null)}
                >
                  ביטול
                </button>
                <button
                  className={styles.dialogConfirm}
                  onClick={handleConfirmDelete}
                >
                  כן, מחק
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
