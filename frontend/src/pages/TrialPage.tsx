import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import React from "react";

const TrialPage = () => {
  const { isDark, toggleTheme } = useThemeStore();
  return (
    <>
      <div>
        <h1>TrialPage </h1>
        <a href="/signin">SignIn</a> <br />
        <a href="/signup">SignUp</a>
        {/* Nút thử sáng tối */}
        <div>
          <Button
            onClick={toggleTheme}
            className={
              isDark ? "bg-slate-800 text-white" : "bg-white text-black"
            }
          >
            {isDark ? "Chế độ Tối" : "Chế độ Sáng"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default TrialPage;
