import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BankAccount } from "@/types/payment";
import type { SavedSlot } from "@/types/calendar";
import { usePaymentDetailsStore } from "@/store/paymentDetailsStore";
import { useBookingStore } from "@/store/bookingStore";
import styles from "./TutorPaymentsPage.module.scss";

interface DraftForm {
  bankNumber: string;
  branchNumber: string;
  accountNumber: string;
  accountName: string;
}

const NEW_ID = "__new__";

const ISRAELI_BANKS = [
  { value: 12, label: "בנק הפועלים" },
  { value: 10, label: "בנק לאומי" },
  { value: 20, label: "בנק מזרחי טפחות" },
  { value: 11, label: "בנק דיסקונט" },
  { value: 31, label: "הבנק הבינלאומי" },
  { value: 14, label: "בנק אוצר החייל" },
  { value: 13, label: "בנק אגוד" },
  { value: 4, label: "בנק מסד" },
  { value: 17, label: "בנק מרכנתיל" },
  { value: 9, label: "בנק ירושלים" },
  { value: 46, label: "בנק יהב" },
  { value: 34, label: "בנק פועלי אגודת ישראל" },
];

function bankLabel(value: number): string {
  return ISRAELI_BANKS.find((b) => b.value === value)?.label ?? String(value);
}

function emptyDraft(): DraftForm {
  return { bankNumber: "", branchNumber: "", accountNumber: "", accountName: "" };
}

function accountToDraft(a: BankAccount): DraftForm {
  return {
    bankNumber: String(a.bankNumber),
    branchNumber: String(a.branchNumber),
    accountNumber: a.accountNumber,
    accountName: a.accountName,
  };
}

function validate(draft: DraftForm): Partial<Record<keyof DraftForm, string>> {
  const errs: Partial<Record<keyof DraftForm, string>> = {};
  if (!draft.accountName.trim()) errs.accountName = "שדה חובה";
  if (!draft.bankNumber || !ISRAELI_BANKS.some((b) => b.value === Number(draft.bankNumber)))
    errs.bankNumber = "יש לבחור בנק";
  if (!draft.branchNumber.trim() || !/^\d{2,4}$/.test(draft.branchNumber))
    errs.branchNumber = "מספר סניף לא תקין";
  if (!draft.accountNumber.trim()) errs.accountNumber = "שדה חובה";
  return errs;
}

export default function TutorPaymentsPage() {
  const navigate = useNavigate();
  const { accounts, fetchAccounts, addAccount, updateAccount, removeAccount, syncing, syncError, clearSyncError } =
    usePaymentDetailsStore();
  const tutorSlots = useBookingStore((s) => s.tutorSlots);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftForm>(emptyDraft());
  const [errors, setErrors] = useState<Partial<Record<keyof DraftForm, string>>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  function beginEdit(account: BankAccount) {
    setEditingId(account.id);
    setDraft(accountToDraft(account));
    setErrors({});
  }

  function beginAdd() {
    setEditingId(NEW_ID);
    setDraft(emptyDraft());
    setErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
    setErrors({});
  }

  function setField(field: keyof DraftForm, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const errs = validate(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      bankNumber: Number(draft.bankNumber),
      branchNumber: Number(draft.branchNumber),
      accountNumber: draft.accountNumber.trim(),
      accountName: draft.accountName.trim(),
    };

    if (editingId === NEW_ID) {
      await addAccount(data);
    } else if (editingId) {
      await updateAccount(editingId, data);
    }

    cancelEdit();
  }

  function slotIsFuture(slot: SavedSlot): boolean {
    const [y, m, d] = slot.weekStart.split("-").map(Number);
    const date = new Date(y, m - 1, d + slot.day - 1);
    const hours = Math.floor(slot.startHour / 2);
    const mins = (slot.startHour % 2) * 30;
    date.setHours(hours, mins, 0, 0);
    return date.getTime() >= Date.now();
  }

  async function confirmDelete(id: string) {
    if (accounts.length === 1 && tutorSlots.some(slotIsFuture)) {
      setShowDeleteDialog(null);
      setShowBlockDialog(true);
      return;
    }
    await removeAccount(id);
    setShowDeleteDialog(null);
  }

  const isNew = editingId === NEW_ID;
  const isEditing = editingId !== null;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>פרטי תשלום</h1>
      <p className={styles.subtitle}>
        כאן תוכל לנהל את חשבונות הבנק שלך לקבלת תשלומים
      </p>

      {syncing && <span className={styles.syncStatus}>שומר...</span>}
      {syncError && (
        <div className={styles.syncErrorBanner}>
          <span>{syncError}</span>
          <div className={styles.syncErrorActions}>
            <button className={styles.syncErrorBtn} onClick={clearSyncError}>אישור</button>
            <button className={styles.syncErrorBtn} onClick={() => usePaymentDetailsStore.getState().syncToBackend()}>נסה שוב</button>
          </div>
        </div>
      )}

      {accounts.length === 0 && !isEditing ? (
        <div className={styles.card} style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "#9ca3af", margin: 0 }}>
            עדיין לא הוספת חשבון בנק
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {accounts.map((account) => {
            const expanded = editingId === account.id;
            return (
              <div key={account.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.accountName}>
                    {account.accountName}
                  </span>
                  {!expanded && (
                    <div className={styles.cardActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => beginEdit(account)}
                        disabled={syncing}
                      >
                        ערוך
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setShowDeleteDialog(account.id)}
                        disabled={syncing}
                      >
                        מחק
                      </button>
                    </div>
                  )}
                </div>

                {expanded ? (
                  <div className={styles.form}>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>שם חשבון</span>
                      <input
                        className={`${styles.fieldInput} ${errors.accountName ? styles.fieldInputError : ""}`}
                        value={draft.accountName}
                        onChange={(e) => setField("accountName", e.target.value)}
                        placeholder="לדוגמה: חשבון שכר"
                      />
                      {errors.accountName && (
                        <span className={styles.fieldError}>{errors.accountName}</span>
                      )}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>בנק</span>
                        <select
                          className={`${styles.fieldInput} ${errors.bankNumber ? styles.fieldInputError : ""}`}
                          value={draft.bankNumber}
                          onChange={(e) => setField("bankNumber", e.target.value)}
                        >
                          <option value="">בחר בנק</option>
                          {ISRAELI_BANKS.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        {errors.bankNumber && (
                          <span className={styles.fieldError}>{errors.bankNumber}</span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>סניף</span>
                        <input
                          className={`${styles.fieldInput} ${errors.branchNumber ? styles.fieldInputError : ""}`}
                          value={draft.branchNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setField("branchNumber", v);
                          }}
                          placeholder="000"
                          maxLength={4}
                        />
                        {errors.branchNumber && (
                          <span className={styles.fieldError}>{errors.branchNumber}</span>
                        )}
                      </div>

                      <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
                        <span className={styles.fieldLabel}>מספר חשבון</span>
                        <input
                          className={`${styles.fieldInput} ${errors.accountNumber ? styles.fieldInputError : ""}`}
                          value={draft.accountNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setField("accountNumber", v);
                          }}
                          placeholder="הכנס מספר חשבון"
                        />
                        {errors.accountNumber && (
                          <span className={styles.fieldError}>{errors.accountNumber}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.formActions}>
                      <button className={styles.cancelBtn} onClick={cancelEdit} disabled={syncing}>
                        ביטול
                      </button>
                      <button className={styles.saveBtn} onClick={handleSave} disabled={syncing}>
                        {isNew ? "הוסף חשבון" : "שמור שינויים"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.summary}>
                    <span className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>בנק:</span>
                      {bankLabel(account.bankNumber)}
                    </span>
                    <span className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>סניף:</span>
                      {account.branchNumber}
                    </span>
                    <span className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>חשבון:</span>
                      {account.accountNumber}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {isNew && (
            <div className={styles.card}>
              <div className={styles.form}>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>שם חשבון</span>
                  <input
                    className={`${styles.fieldInput} ${errors.accountName ? styles.fieldInputError : ""}`}
                    value={draft.accountName}
                    onChange={(e) => setField("accountName", e.target.value)}
                    placeholder="לדוגמה: חשבון שכר"
                  />
                  {errors.accountName && (
                    <span className={styles.fieldError}>{errors.accountName}</span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <span className={styles.fieldLabel}>בנק</span>
                    <select
                      className={`${styles.fieldInput} ${errors.bankNumber ? styles.fieldInputError : ""}`}
                      value={draft.bankNumber}
                      onChange={(e) => setField("bankNumber", e.target.value)}
                    >
                      <option value="">בחר בנק</option>
                      {ISRAELI_BANKS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                    {errors.bankNumber && (
                      <span className={styles.fieldError}>{errors.bankNumber}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <span className={styles.fieldLabel}>סניף</span>
                    <input
                      className={`${styles.fieldInput} ${errors.branchNumber ? styles.fieldInputError : ""}`}
                      value={draft.branchNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setField("branchNumber", v);
                      }}
                      placeholder="000"
                      maxLength={4}
                    />
                    {errors.branchNumber && (
                      <span className={styles.fieldError}>{errors.branchNumber}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
                    <span className={styles.fieldLabel}>מספר חשבון</span>
                    <input
                      className={`${styles.fieldInput} ${errors.accountNumber ? styles.fieldInputError : ""}`}
                      value={draft.accountNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setField("accountNumber", v);
                      }}
                      placeholder="הכנס מספר חשבון"
                    />
                    {errors.accountNumber && (
                      <span className={styles.fieldError}>{errors.accountNumber}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button className={styles.cancelBtn} onClick={cancelEdit} disabled={syncing}>
                    ביטול
                  </button>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={syncing}>
                    הוסף חשבון
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isEditing && accounts.length < 3 && (
        <div className={styles.addArea}>
          <button className={styles.addBtn} onClick={beginAdd} disabled={syncing}>
            הוסף חשבון בנק
          </button>
        </div>
      )}

      {showBlockDialog && (
        <div className={styles.overlay} onClick={() => setShowBlockDialog(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.dialogText}>לא ניתן למחוק חשבון בנק</p>
            <p className={styles.dialogBody}>
              יש לך שיעורים עתידיים בלוח הזמנים. על מנת למחוק חשבון בנק, מחק תחילה את השיעורים העתידיים.
            </p>
            <div className={styles.dialogActions}>
              <button className={styles.dialogCancel} onClick={() => setShowBlockDialog(false)}>
                ביטול
              </button>
              <button className={styles.blockLinkBtn} onClick={() => navigate("/tutor/calendar")}>
                מעבר ליומן
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className={styles.overlay} onClick={() => setShowDeleteDialog(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.dialogText}>האם למחוק חשבון בנק זה?</p>
            <div className={styles.dialogActions}>
              <button className={styles.dialogCancel} onClick={() => setShowDeleteDialog(null)} disabled={syncing}>
                ביטול
              </button>
              <button className={styles.dialogConfirm} onClick={() => confirmDelete(showDeleteDialog)} disabled={syncing}>
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
