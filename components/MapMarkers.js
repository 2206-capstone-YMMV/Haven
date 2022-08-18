import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";

export default function MapMarkers() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("https://enigmatic-reaches-55405.herokuapp.com/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports);
      })
      .catch(console.error);
  });

  return reports.map((report) => (
    <Marker
      key={report.id}
      coordinate={{ latitude: report.lat, longitude: report.lon }}
      title={report.location}
      description={report.comments}
    ></Marker>
  ));
}
