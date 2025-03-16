import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EarningsCalendar from "./widgets/EarningsCalendar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <EarningsCalendar />
    </>
  );
}

export default App;
