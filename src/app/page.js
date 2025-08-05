import Hero from "./components/Hero";
import Header from "./components/Header";
import Goal from "./components/Goal";
import Solution from "./components/Solution";
import Workflow from "./components/Workflow";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <Goal/>
      <Solution/>
      <Workflow/>
    </div>

  );
}
