import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const listeleClass = "siralama";

const FlightInfo = ({
  sortType,
  handleSort,
  city,
  from,
  setFrom,
  to,
  setTo,
  setDepartureDate,
  departureDate,
  arrivalDate,
  setArrivalDate,
  tekYon,
  setTekYon,
  listele,
  arrivalListele,
  listClass,
  setListClass,
  setYeni,
  formattedDate,
  formattedArrivalDate,
  yeni,
  resim,
}) => {
  const change = () => {
    setTekYon(!tekYon);
    setArrivalDate(null);
    setListClass("hiderarrival");
  };
  if (!city || city.length === 0) {
    return (
      <div className="flight-info">
        <div className="loading-spinner"></div>
        <p>Şehir isimleri yükleniyor...</p>
      </div>
    );
  }
  return (
    <div className="flight-info">
      <div className="sorting">
        <label>Sıralama : </label>
        <select
          value={sortType}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="departureTime">Kalkış Saati</option>
          <option value="arrivalTime">Varış Saati</option>
          <option value="duration">Uçuş Süresi</option>
          <option value="price">Fiyat</option>
        </select>
      </div>
      <div className="header-container">
        <h2>Flight Info</h2>
      </div>
      <div className="tekyon-container">
        <label htmlFor="tekyon">Tek Yön</label>
        <input id="tekyon" type="checkbox" onClick={change} />
      </div>
      <div className="input-container">
        <div className="input">
          <div className="icon">
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              size="lg"
              style={{ color: "#000000" }}
            />
            <label>From</label>
          </div>
          {/* Gidiş Havalimanı Seçimi */}
          <div className="input-area">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={city}
              freeSolo
              sx={{ width: 300 }}
              onInputChange={(e) => {
                setFrom(e.target.value);
              }}
              onChange={(e, value) => {
                setFrom(value?.toLocaleLowerCase());
              }}
              renderInput={(params) => (
                <TextField {...params} label="From" />
              )}
            />
          </div>
        </div>
        <div className="input">
          <div className="icon">
            <FontAwesomeIcon
              icon={faPlaneArrival}
              size="lg"
              style={{ color: "#000000" }}
            />
            <label>To</label>
          </div>
          {/* Varış Havalimanı Seçimi */}
          <div className="input-area">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={city}
              freeSolo
              sx={{ width: 300 }}
              onInputChange={(e) => {
                setTo(e.target.value);
              }}
              onChange={(e, value) => {
                setTo(value?.toLocaleLowerCase());
              }}
              renderInput={(params) => <TextField {...params} label="To" />}
            />
          </div>
        </div>
        {/* Gidiş Tarihi Seçimi */}
        <div className="input">
          <div className="icon">
            <FontAwesomeIcon
              icon={faCalendarDays}
              size="lg"
              style={{ color: "#000000" }}
            />
            <label>Departure Date</label>
          </div>
          <div className="input-area">
            <DatePicker
              isClearable
              className="datepicker"
              dateFormat="dd/MM/yyyy"
              placeholderText="Departure Date"
              selected={departureDate}
              onChange={(date) => {
                setYeni(true);
                setDepartureDate(date);
              }}
              dayClassName={(date) => {
                const formattedDate = `${date.getDate()} ${date.toLocaleString(
                  "default",
                  { month: "short" }
                )} ${date.getFullYear()}`;
                const isFlightDate = listele.some((flight) => {
                  return (
                    flight.kalkis_havalimani?.toLocaleLowerCase()
                      .includes(from) &&
                    flight.inis_havalimani?.toLocaleLowerCase()
                      .includes(to) &&
                    flight.gidis_tarihi === formattedDate
                  );
                });
                if (isFlightDate) {
                  return "has-flight";
                }
                return null;
              }}
            />
          </div>
        </div>
        {/* Dönüş Tarihi Seçimi */}
        <div className="input">
          <div className="icon">
            <FontAwesomeIcon
              icon={faCalendarDays}
              size="lg"
              style={{ color: "#000000" }}
            />
            <label>Return Date</label>
          </div>
          <div className="input-area">
            <DatePicker
              isClearable
              className="datepicker"
              dateFormat="dd/MM/yyyy"
              placeholderText="Return Date"
              dayClassName={(date) => {
                const formattedDate = `${date.getDate()} ${date.toLocaleString(
                  "default",
                  { month: "short" }
                )} ${date.getFullYear()}`;

                // Burada belirli bir uçuşun tarihini kontrol edin
                const isFlightDate = arrivalListele.some((flight) => {
                  return (
                    flight.kalkis_havalimani?.toLocaleLowerCase()
                      .includes(to) &&
                    flight.inis_havalimani?.toLocaleLowerCase()
                      .includes(from) &&
                    flight.gelis_tarihi === formattedDate
                  );
                });

                // Eğer seçilen tarih bir uçuş tarihi ise, arka plan rengini belirle
                if (isFlightDate && yeni) {
                  return "has-flight";
                }

                // Uçuş tarihi değilse, herhangi bir özel stil uygulamayın.
                return null;
              }}
              disabled={tekYon ? true : false}
              selected={arrivalDate}
              onChange={(date) => {
                setListClass("arrival");
                setArrivalDate(date);
              }}
            />
          </div>
        </div>
      </div>
      <div className="list-flights">
        <div className="departure">
          {!listele ? (
            <p>Yükleniyor... </p>
          ) : (
            listele?.map((veri, index) => {
              if (!veri.gidis_tarihi) {
                return null;
              }
              if (veri.gidis_tarihi === formattedDate) {
                return (
                  <div className={listeleClass} key={index}>
                    <h2>{veri.kalkis_havalimani}</h2>
                    <h3>{veri.inis_havalimani}</h3>
                    <h3>{ <img src={resim(veri.hava_yolu)} alt="havayolu" />}{veri.hava_yolu}</h3>
                    <p>Kalkış Saati: {veri.kalkis_saati}</p>
                    <p>İniş Saati: {veri.inis_saati}</p>
                    <p>Uçuş Süresi: {veri.ucus_suresi}</p>
                    <p>Gidis Tarihi: {veri.gidis_tarihi}</p>
                    <p>Fiyat: {veri.fiyat}₺</p>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
        {formattedArrivalDate ? (
          <div className={listClass}>
            {!arrivalListele ? (
              <p>Yükleniyor... </p>
            ) : (
              arrivalListele?.map((veri, index) => {
                if (!veri.gelis_tarihi) {
                  return null;
                }
                if (veri.gelis_tarihi === formattedArrivalDate && yeni) {
                  return (
                    <div className={listeleClass} key={index}>
                      <h2>{veri.kalkis_havalimani}</h2>
                      <h3>{veri.inis_havalimani}</h3>
                      <h3>{ <img src={resim(veri.hava_yolu)} alt="havayolu" />}{veri.hava_yolu}</h3>
                      <p>Kalkış Saati: {veri.kalkis_saati}</p>
                      <p>İniş Saati: {veri.inis_saati}</p>
                      <p>Uçuş Süresi: {veri.ucus_suresi}</p>
                      <p>Donus Tarihi: {veri.gelis_tarihi}</p>
                      <p>Fiyat: {veri.fiyat}₺</p>
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        ) : (
          setListClass("hidearrival")
        )}
      </div>
    </div>
  );
};

export default FlightInfo;