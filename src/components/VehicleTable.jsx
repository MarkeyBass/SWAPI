import React, { useState, useEffect, Fragment } from "react";
import "./VehicleTable.css";

const VehicleTable = () => {
  const [chosenVehicle, setChosenVehicle] = useState(null);

  const [error, setError] = useState(null);

  const getAndModifyVehicles = async () => {
    setError(null);

    let chosenVehicleTemp = {};
    let homeworldsDict = {};
    let pilotsDict = {};
    let maxPopulation = -1;

    try {
      const res = await fetch("https://swapi.dev/api/vehicles");
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Can't get vehicles data - 404 status code");
        } else {
          throw new Error("Something went wrong...");
        }
      }

      const data = await res.json();
      const vehicles = data.results;

      await Promise.all(
        vehicles.map(async (vehicle) => {
          vehicle.sumOfPopulations = 0;
          if (vehicle.pilots.length === 0) {
            return;
          }

          await Promise.all(
            vehicle.pilots.map(async (pilotUrl) => {
              let pilot = pilotsDict[pilotUrl];
              if (!pilot) {
                const res = await fetch(pilotUrl);
                if (!res.ok) {
                  if (res.status === 404) {
                    throw new Error("Can't get pilots data - 404 status code");
                  } else {
                    throw new Error("Something went wrong...");
                  }
                }

                pilot = await res.json();

                pilotsDict[pilotUrl] = pilot;
              }

              const homeworldUrl = pilot.homeworld;
              let homeworld = homeworldsDict[homeworldUrl];
              if (!homeworld) {
                const homeworldRes = await fetch(homeworldUrl);
                if (!homeworldRes.ok) {
                  if (homeworldRes.status === 404) {
                    throw new Error("Can't get homeworlds data - 404 status code");
                  } else {
                    throw new Error("Something went wrong...");
                  }
                }
                homeworld = await homeworldRes.json();

                homeworldsDict[homeworldUrl] = homeworld;
              }

              // Modifications Of Main Object
              // ==============================================
              // calculating sum of populations per vehicle -
              // adding population only if the particular homeland doesn't exists in vehiclesDict

              if (!vehicle[homeworldUrl]) {
                vehicle.sumOfPopulations += parseInt(homeworld.population);
              }

              vehicle[pilotUrl] = {
                ...pilot,
                homeworldUrl: pilot.homeworld,
                homeworldName: homeworld.name,
                homeworldPopulation: homeworld.population,
              };

              vehicle[homeworldUrl] = homeworld;
            })
          );

          if (vehicle.sumOfPopulations > maxPopulation) {
            chosenVehicleTemp = vehicle;
            maxPopulation = chosenVehicleTemp.sumOfPopulations;
          }

          // End Of Outer Loop (vehicle) Block
        })
      );

      setChosenVehicle(chosenVehicleTemp);

      console.log({ pilotsDict });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    getAndModifyVehicles();
  }, []);

  const output = (
    <div className="vehicleTable">
      {console.log({ chosenVehicle })}

      {chosenVehicle && (
        <table>
          <thead>
            <tr>
              <th>{chosenVehicle.name}</th>
            </tr>
          </thead>
          <tbody>
            {chosenVehicle.pilots.map((pilotUrl) => {
              return (
                <Fragment key={pilotUrl}>
                  <tr>
                    <td>
                      {chosenVehicle[pilotUrl].homeworldName} -{" "}
                      {chosenVehicle[pilotUrl].homeworldPopulation}
                    </td>
                  </tr>
                </Fragment>
              );
            })}

            {chosenVehicle.pilots.map((pilotUrl) => {
              return (
                <tr key={pilotUrl}>
                  <td>{chosenVehicle[pilotUrl].name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
  return (
    <Fragment>
      {!error && output}
      {error && (
        <div className="vehicleTable" style={{ color: "red", fontSize: "2rem" }}>
          {error}
        </div>
      )}
    </Fragment>
  );
};

export default VehicleTable;
