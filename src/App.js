import React, { useState, useEffect } from "react";
import FlightInfo from "./Component/FlightInfo";
import axios from "axios";
import "./App.css";
import Thy from './Img/thy.png';
import Pegasus from './Img/pegasus.png';
import Anadolujet from './Img/anadolujet.png';
import OnurAir from './Img/onurair.png';
import Header from "./Component/Header";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [departureDate, setDepartureDate] = useState(new Date());
  const formattedDate = `${departureDate?.getDate()} ${departureDate?.toLocaleString(
    "default",
    { month: "short" }
  )} ${departureDate?.getFullYear()}`;
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const formattedArrivalDate = `${arrivalDate?.getDate()} ${arrivalDate?.toLocaleString(
    "default",
    { month: "short" }
  )} ${arrivalDate?.getFullYear()}`;
  const [tekYon, setTekYon] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [listele, setListele] = useState([]);
  const [arrivalListele, setarrivalListele] = useState([]);
  const [listClass, setListClass] = useState("hidearrival");
  const [city, setCities] = useState([]);
  const [yeni, setYeni] = useState(false);
  const [sadeceSehir, setSadeceSehir] = useState([]);
  const [flightinformation, setflightinformation] = useState([]);
  const [sortType, setSortType] = useState("");
  
  const baseURL = "https://64faeb40cb9c00518f7a5f6a.mockapi.io/cities";
  const baseURL2 =
    "https://64faeb40cb9c00518f7a5f6a.mockapi.io/flightinformation";


  // Mock API'den şehir verilerini al
  const getData = async () => {
    await axios.get(`${baseURL}`).then((response) => {
      const data = response.data;
      setSadeceSehir([...sadeceSehir, ...data]);
    });
  };

  // Mock API'den uçuş bilgilerini al
  const getOtherData = async () => {
    await axios.get(`${baseURL2}`).then((response) => {
      const data = response.data;
      setflightinformation([...flightinformation, ...data]);
    });
  };

  // Uçuşları sıralamak için kullanılan fonksiyonlar
  const handleSort = (type) => {
    setSortType(type);
  };

  const sortFlights = (flights, type) => {
    switch (type) {
      case "departureTime":
        return flights
          .slice()
          .sort((a, b) => a.kalkis_saati?.localeCompare(b.kalkis_saati));
      case "arrivalTime":
        return flights
          .slice()
          .sort((a, b) => a.inis_saati?.localeCompare(b.inis_saati));
      case "duration":
        return flights
          .slice()
          .sort((a, b) => a.ucus_suresi?.localeCompare(b.ucus_suresi));
      case "price":
        return flights.slice().sort((a, b) => a.fiyat - b.fiyat);
      default:
        return flights;
    }
  };

  useEffect(() => {
    // Şehir verilerini al
    getData();
    // Diğer uçuş bilgilerini al
    getOtherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Sadece şehir isimlerini alarak şehirleri doldur
    const sadeceSehirler = sadeceSehir.map((veri) => veri.sehir);
    setCities(sadeceSehirler);
  }, [sadeceSehir]);

  useEffect(() => {
    if (to) {
      // Gidiş ve dönüş uçuşlarını filtrele
      const filteredFlights = flightinformation.filter(
        (veri) =>
          veri.kalkis_havalimani?.toLocaleLowerCase().includes(from) &&
          veri.inis_havalimani?.toLocaleLowerCase().includes(to)
      );
      setarrivalListele(
        flightinformation.filter(
          (veri) =>
            veri.kalkis_havalimani?.toLocaleLowerCase().includes(to) &&
            veri.inis_havalimani?.toLocaleLowerCase().includes(from)
        )
      );

      const sortedFlights = sortFlights(filteredFlights, sortType);
      setListele(sortedFlights);
    } else {
      setListele([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, sortType]);
  const resim = (e) =>{
    switch(e) {
      case "Türk Hava Yolları":
        return Thy
      case "Pegasus":
        return Pegasus
      case "AnadoluJet":
        return Anadolujet
      case "OnurAir":
        return OnurAir
      default:
        return null;
    }
  }
  return (
    <div className="App">
      <Header />
      <main>
        <FlightInfo
        sortType={sortType}
        handleSort={handleSort}
        city={city}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        tekYon={tekYon}
        setTekYon={setTekYon}
        listele={listele}
        arrivalListele={arrivalListele}
        listClass={listClass}
        setListClass={setListClass}
        formattedDate={formattedDate}
        formattedArrivalDate={formattedArrivalDate}
        yeni={yeni}
        setYeni={setYeni}
        resim={resim}
      /> 
      
      </main>
    </div>
  );
}

export default App;