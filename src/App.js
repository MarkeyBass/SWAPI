import "./App.css";

import r2d2 from "../src/images/star_wars_icon_tashlil_2.png";
import VehicleTable from "./components/VehicleTable";
import PlanetsPopulation from "./components/PlanetsPopulation";

function App() {
  return (
    <div className="App">
      <p style={{ color: "white", alignSelf: "flex-start", margin: "66px 0 0 74px" }}>
        © Mark Kirzhner
      </p>
      <img
        alt="R2D2"
        style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "50px" }}
        // style={{ maxWidth: "200px" }}
        src={r2d2}
      ></img>
      <VehicleTable />

      <PlanetsPopulation />
    </div>
  );
}

export default App;
