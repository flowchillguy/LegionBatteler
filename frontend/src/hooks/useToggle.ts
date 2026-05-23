import { useState } from "react";

export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // Hàm thực hiện logic đảo ngược trạng thái
  const toggle = () => {
    setValue((prev) => !prev);
  };

  return [value, toggle];
}
