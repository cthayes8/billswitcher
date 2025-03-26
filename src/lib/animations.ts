
import { Config } from "tailwindcss";

export const addProgressAnimations = (config: Config) => {
  if (!config.theme) config.theme = {};
  
  // Add keyframes for progress animation
  if (!config.theme.extend) config.theme.extend = {};
  if (!config.theme.extend.keyframes) config.theme.extend.keyframes = {};
  
  config.theme.extend.keyframes = {
    ...config.theme.extend.keyframes,
    "progress-indeterminate": {
      "0%": { transform: "translateX(-100%)" },
      "50%": { transform: "translateX(0%)" },
      "100%": { transform: "translateX(100%)" }
    }
  };
  
  // Add animation for progress
  if (!config.theme.extend.animation) config.theme.extend.animation = {};
  
  config.theme.extend.animation = {
    ...config.theme.extend.animation,
    "progress-indeterminate": "progress-indeterminate 1.5s ease-in-out infinite"
  };
  
  return config;
};
