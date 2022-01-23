import React, { Fragment, useEffect } from "react";
import { useState } from "react";

const PlanetsPopulation = () => {
  const [planetsState, setPlanetsState] = useState([]);

  const [error, setError] = useState(null);

  const fetchplanets = async () => {
    setError(null);

    try {
      const res = await fetch("https://swapi.dev/api/planets/");
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Can't get vehicles data - 404 status code");
        } else {
          throw new Error("Something went wrong...");
        }
      }

      const data = await res.json();
      const planets = data.results;

      // modification of planets array:
      planets.sort((a, b) => b.population * 1 - a.population * 1);

      for (let i = 0; i < planets.length; i++) {
        if (planets[i].population === "unknown") {
          planets[i].barColor = "red";
        } else {
          planets[i].barColor = "white";
        }

        if (i === 0 || planets[i].population === "unknown") {
          planets[i].barPercent = 100;
        } else if (planets[i].population * 100 < planets[i - 1].population * 1) {
          planets[i].barPercent = planets[i - 1].barPercent * 0.3;
        } else if (planets[i].population * 10 < planets[i - 1].population * 1) {
          planets[i].barPercent = planets[i - 1].barPercent * 0.5;
        } else if (planets[i].population * 1 < planets[i - 1].population * 1) {
          planets[i].barPercent = planets[i - 1].barPercent * 0.7;
        } else {
          planets[i].barPercent = planets[i - 1].barPercent * 0.8;
        }
      }

      console.log({ planets });

      setPlanetsState(planets);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchplanets();
  }, []);

  const output = (
    <div style={{ color: "white", margin: "50px 0" }}>
      {planetsState.length > 0 && (
        <Fragment>
          <div style={{ margin: "30px 0 5px 0" }}>
            <p>
              Comparison of planets population. Chart bar proportions are only for illustration.
            </p>
            Planets with unknown population have a <span style={{ color: "red" }}> red</span> bar.
            <p></p>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "50px",
              alignItems: "flex-start",
            }}
          >
            {planetsState.map((planet) => {
              return (
                <div
                  key={planet.url}
                  style={{
                    marginLeft: "35px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "250px",
                  }}
                >
                  <p style={{ fontSize: "0.8rem" }}>{planet.population}</p>
                  <div
                    style={{
                      height: planet.barPercent + "%",
                      width: "50px",
                      backgroundColor: planet.barColor,
                      border: "solid white 1px",
                    }}
                  ></div>
                  <div style={{ color: "white", margin: "20px 0" }}>{planet.name}</div>
                </div>
              );
            })}
          </div>
        </Fragment>
      )}
    </div>
  );

  return (
    <Fragment>
      {!error && output}
      {error && <div style={{ color: "red", fontSize: "2rem", margin: "50px 0" }}>{error}</div>}
    </Fragment>
  );
};

export default PlanetsPopulation;
