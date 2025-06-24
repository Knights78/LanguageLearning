//zustand is used similar that of react context or react redux 
//we can acess the variables and functions from any component
import {create }from 'zustand'    
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("s-theme") ||'coffee', // Default theme   
  setTheme: (newTheme) => {
    localStorage.setItem("s-theme", newTheme); // Save theme to localStorage
    set({ theme: newTheme }); 
  } // Function to update the theme   
}));