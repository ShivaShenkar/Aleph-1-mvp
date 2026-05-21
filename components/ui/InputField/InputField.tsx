import styles from "./InputField.module.scss";

interface InputFieldProps {
  label?: string;
  type?: string;
  width?: string;
  lines?: number;
  dropdown?: boolean;
  dropdownLabels?: string[];
  placeholder?: string;
}

const INPUT_LINE_HEIGHT = 1.5;
const INPUT_VERTICAL_PADDING = 1;
const INPUT_BORDER = 0.1875;

export default function InputField({
  label,
  type="text",
  width = "16.25rem",
  lines = 1,
  dropdown  = false,
  dropdownLabels = [],
  placeholder = "",
}: InputFieldProps) {
  const inputHeight = `${lines * INPUT_LINE_HEIGHT + INPUT_VERTICAL_PADDING + INPUT_BORDER}rem`;

return (
    <div className={styles.container} style={{ width }}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.inputArea} style={{ height: inputHeight }}>
        {dropdown && dropdownLabels ? (
          <select className={`${styles.input} ${styles.select}`}>
            {placeholder && <option value={placeholder}>{placeholder}</option>}
            {dropdownLabels.map((label, i) => (
              <option key={i} value={label}>
                {label}
              </option>
            ))}
          </select>
        ) : lines > 1 ? (
          <textarea className={styles.textarea} placeholder={placeholder} />
        ) : (
          <input type={type} className={styles.input} placeholder={placeholder} />
        )}
        {dropdown && (
          <span className={styles.dropdown}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 10L12 15L17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

