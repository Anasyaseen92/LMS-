"use client";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark") ? "light" : "dark"
        )
      }
      className="mx-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/20 bg-white text-black transition-colors dark:border-white/20 dark:bg-slate-800 dark:text-yellow-300"
      aria-label="Toggle theme"
    >
      <BiMoon size={20} className="block dark:hidden" />
      <BiSun size={20} className="hidden dark:block" />
    </button>
  );
};
