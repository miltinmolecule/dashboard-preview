import { ChangeEvent } from "react";

interface PrefixProps {
  startContent?: React.ReactNode | string;
  endContent?: React.ReactNode | string;
}

interface AppInputProps extends PrefixProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  inputRender?: "normal" | "textarea";
  type?: "text" | "password" | "email" | "date" | "file" | "textarea";
  inputWrapper?: string;
  wrapperClass?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  maxDate?: string;
  minDate?: string;
  rows?: number;
  isDisabled?: boolean;
  readonly?: boolean;
  inputClass?: string;
  onBlur?: (e: any) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: string | null | any;
  [key: string]: any;
}

const AppInput = ({
  errors,
  onChange,
  onBlur,
  rows,
  wrapperClass,
  placeholder,
  value,
  name,
  type,
  readonly,
  inputRender = "normal",
  inputWrapper,
  inputClass,
  startContent,
  maxDate,
  minDate,
  label,
  endContent,
  isDisabled,
  ...props
}: AppInputProps) => {
  return (
    <div
      className={`flex flex-col w-full mb-[5px] ${wrapperClass}`}
      aria-labelledby={`input-for-${name}`}
    >
      {label && (
        <label
          className="text-sm flex mb-2 
        "
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center justify-between ${
          startContent || endContent ? "px-2" : "px-4"
        } bg-[#F8FAFC] rounded-lg ${
          inputRender === "normal" ? "h-11.25" : "min-h-12"
        } border border-(--inputBorder)/30 ${inputWrapper}`}
      >
        {startContent && startContent}

        {inputRender === "textarea" ? (
          <textarea
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            disabled={isDisabled}
            readOnly={readonly}
            rows={rows || 5}
            className={`flex-1 text-sm pt-2 font-normal h-full outline-none border-0 ${inputClass} ${
              startContent || endContent ? "px-2" : "px-0"
            }`}
          ></textarea>
        ) : (
          <input
            name={name}
            id={name}
            type={type}
            placeholder={placeholder}
            value={value}
            disabled={isDisabled}
            readOnly={readonly}
            onBlur={onBlur}
            onChange={onChange}
            className={`flex-1 text-sm font-normal h-full outline-none border-0 ${inputClass} ${
              startContent || endContent ? "px-2" : "px-0"
            }`}
            max={type === "date" ? maxDate : undefined}
            min={type === "date" ? minDate : undefined}
            {...props}
          />
        )}
        {endContent && endContent}
      </div>
      {errors && (
        <p className="text-xs text-(--error) font-normal p-2 ">{errors}</p>
      )}
    </div>
  );
};

export default AppInput;
