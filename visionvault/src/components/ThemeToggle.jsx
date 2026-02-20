import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
    >
      {darkMode ? 
        <FaSun className="text-yellow-300 text-xs" /> : 
        <FaMoon className="text-gray-300 text-xs" />
      }
    </button>
  );
}

export default ThemeToggle;