import { useFormContext, ValidateResult } from "react-hook-form";
import { ValidationFn } from "../providers";
import { useEffect, useMemo, useState } from "react";

interface ValidationCheckListProps {
  name: string;
  validate: Record<string, ValidationFn>;
}

export function ValidationCheckList({name, validate}: ValidationCheckListProps) {
  const { watch } = useFormContext();
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const { unsubscribe } = watch((fieldValues, { name: fieldName }) => {
      if (fieldName === name) {
        setValue(fieldValues[name]);
      }
    });
    return () => unsubscribe();
  }, [name, watch]);

  const items = useMemo(() => Object.keys(validate).map((key) => {
    const checked: ValidateResult = validate[key](value || '') as ValidateResult;
    return {
      key,
      checked: checked === true,
    };
  }), [validate, value]);


  return (
    <ul>
      {items.map((item) => (
        <li key={item.key}>
          <input type="checkbox" checked={item.checked} readOnly />
          {item.key}
        </li>
      ))}
    </ul>
  )
}