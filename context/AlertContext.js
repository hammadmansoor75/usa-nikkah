"use client"

import { createContext, useContext, useState } from "react";
import AlertModel from "@/components/AlertModel";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ isOpen: false, message: "" });

  const showAlert = (message) => {
    setAlert({ isOpen: true, message });
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModel
        isOpen={alert.isOpen}
        message={alert.message}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
