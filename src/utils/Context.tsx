"use client";
import { createContext, useState, ReactNode } from 'react';

interface MyContextProps {
  someValue: string;
  setSomeValue: (value: string) => void;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [someValue, setSomeValue] = useState('Hello from Context!');

  return (
    <MyContext.Provider value={{ someValue, setSomeValue }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;