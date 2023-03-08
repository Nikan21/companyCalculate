import { useState, useEffect, useCallback, useRef } from "react";
import "./App.sass";
import backblaze from "./images/backblaze.webp";
import bunny from "./images/bunny.jpg";
import scaleway from "./images/scaleway.png";
import vultr from "./images/vultr.png";

function App() {
  const [storage, changeStorage] = useState(0);
  const [transfer, changeTransfer] = useState(0);
  const [priceBacklaze, changePriceBacklaze] = useState(0);
  const [priceBunny, changePriceBunny] = useState(0);
  const [priceScaleway, changePriceScaleway] = useState(0);
  const [priceVultr, changePriceVultr] = useState(0);
  const [hdd, changeHDD] = useState(true);
  const [single, changeSingle] = useState(true);

  const backblazeRef = useRef();
  const bunnyRef = useRef();
  const scalewayRef = useRef();
  const vultrRef = useRef();
  const bothScaleRef = useRef();
  const companyAndScheduleRef = useRef();

  const changeStorageValue = (event) => {
    const value = +event.target.value;
    changeStorage(value);
  };

  const changeTransferValue = (event) => {
    const value = +event.target.value;
    changeTransfer(value);
  };

  const changeRadioInput = (event) => {
    const targetClassList = event.target.classList;

    if (targetClassList.contains("hdd")) {
      changeHDD(true);
    } else if (targetClassList.contains("ssd")) {
      changeHDD(false);
    } else if (targetClassList.contains("single")) {
      changeSingle(true);
    } else {
      changeSingle(false);
    }
  };

  const sum = useCallback(() => {
    const valueBacklaze = 0.005 * storage + 0.01 * transfer;

    if (valueBacklaze > 0 && valueBacklaze < 7) {
      changePriceBacklaze(7);
    } else {
      changePriceBacklaze(valueBacklaze.toFixed(2));
    }

    let valueBunny;

    if (hdd) {
      valueBunny = 0.01 * storage + 0.01 * transfer;
    } else {
      valueBunny = 0.02 * storage + 0.01 * transfer;
    }

    if (valueBunny >= 10) {
      changePriceBunny(10);
    } else {
      changePriceBunny(valueBunny.toFixed(2));
    }

    let middleWareStorage;
    let middleWareTransfer;

    if (storage <= 75) {
      middleWareStorage = 0;
    } else {
      if (single) {
        middleWareStorage = 0.03 * (storage - 75);
      } else {
        middleWareStorage = 0.06 * (storage - 75);
      }
    }

    if (transfer <= 75) {
      middleWareTransfer = 0;
    } else {
      middleWareTransfer = 0.02 * (transfer - 75);
    }

    const valueScaleway = middleWareStorage + middleWareTransfer;
    changePriceScaleway(valueScaleway.toFixed(2));

    const valueVultr = 0.01 * storage + 0.01 * transfer;

    if (valueVultr > 0 && valueVultr < 5) {
      changePriceVultr(5);
    } else {
      changePriceVultr(valueVultr.toFixed(2));
    }
  }, [storage, transfer, hdd, single]);

  const changeScale = useCallback(() => {
    backblazeRef.current.style.width = 7 * priceBacklaze + "px";
    bunnyRef.current.style.width = 7 * priceBunny + "px";
    scalewayRef.current.style.width = 7 * priceScaleway + "px";
    vultrRef.current.style.width = 7 * priceVultr + "px";
  }, [priceBacklaze, priceBunny, priceScaleway, priceVultr]);

  const changeColourScale = useCallback(() => {
    const prices = {
      priceBacklaze: priceBacklaze,
      priceBunny: priceBunny,
      priceScaleway: priceScaleway,
      priceVultr: priceVultr,
    };

    let lessPrice = 999999;
    let arrayLessPrices = [];

    for (const [key, value] of Object.entries(prices)) {
      if (+value < lessPrice) {
        lessPrice = value;
        arrayLessPrices = [];
        arrayLessPrices.push(key);
      } else if (value === lessPrice) {
        arrayLessPrices.push(key);
      }
    }

    backblazeRef.current.style.backgroundColor = "gray";
    bunnyRef.current.style.backgroundColor = "gray";
    scalewayRef.current.style.backgroundColor = "gray";
    vultrRef.current.style.backgroundColor = "gray";

    arrayLessPrices.forEach((nameCompany) => {
      switch (nameCompany) {
        case "priceBacklaze":
          backblazeRef.current.style.backgroundColor = "red";
          break;
        case "priceBunny":
          bunnyRef.current.style.backgroundColor = "orange";
          break;
        case "priceScaleway":
          scalewayRef.current.style.backgroundColor = "violet";
          break;
        case "priceVultr":
          vultrRef.current.style.backgroundColor = "blue";
          break;
        default:
          break;
      }
    });
  }, [priceBacklaze, priceBunny, priceScaleway, priceVultr]);

  const changeElements = useCallback(() => {
    let windowWidth = window.innerWidth;

    const handleWindowResize = () => {
      windowWidth = window.innerWidth;

      if (windowWidth > 800) {
        companyAndScheduleRef.current.after(bothScaleRef.current);
      } else {
        companyAndScheduleRef.current.before(bothScaleRef.current);
      }
    };

    window.addEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    sum();
    changeScale();
    changeColourScale();
    changeElements();
  }, [
    storage,
    transfer,
    hdd,
    single,
    sum,
    changeScale,
    changeColourScale,
    changeElements,
  ]);

  if (window.innerWidth > 800) {
    return (
      <div className="App">
        <div ref={companyAndScheduleRef} className="companyAndScheduleWrapper">
          <div className="companyWrapper">
            <div className="nameCompanyWrapper">
              <div className="company">backblaze</div>
              <div className="companyAndOptionsWrapper">
                <div className="company">bunny</div>
                <input
                  onChange={changeRadioInput}
                  defaultChecked
                  className="inputRadio hdd"
                  type="radio"
                  name="hardDrive"
                />
                <span className="option">HDD</span>
                <input
                  onChange={changeRadioInput}
                  className="inputRadio ssd"
                  type="radio"
                  name="hardDrive"
                />
                <span className="option">SSD</span>
              </div>
              <div className="companyAndOptionsWrapper">
                <div className="company">scaleway</div>
                <input
                  onChange={changeRadioInput}
                  className="inputRadio multi"
                  type="radio"
                  name="quantity"
                />
                <span className="option">Multi</span>
                <input
                  onChange={changeRadioInput}
                  defaultChecked
                  className="inputRadio single"
                  type="radio"
                  name="quantity"
                />
                <span className="option">Single</span>
              </div>
              <div className="company">vultr</div>
            </div>
            <div className="imageCompanyWrapper">
              <img src={backblaze} alt="Backblaze" className="imageCompany" />
              <img src={bunny} alt="Bunny" className="imageCompany" />
              <img src={scaleway} alt="Scaleway" className="imageCompany" />
              <img src={vultr} alt="Vultr" className="imageCompany" />
            </div>
          </div>

          <div className="scheduleWrapper">
            <div className="startBorder"></div>
            <div className="linesWrapper">
              <div className="lineAndSumWrapper">
                <div ref={backblazeRef} className="line backblazeLine"></div>
                <span className="sum">{priceBacklaze}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={bunnyRef} className="line bunnyLine"></div>
                <span className="sum">{priceBunny}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={scalewayRef} className="line scalewayLine"></div>
                <span className="sum">{priceScaleway}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={vultrRef} className="line vultrLine"></div>
                <span className="sum">{priceVultr}$</span>
              </div>
            </div>
          </div>
        </div>

        <div ref={bothScaleRef} className="bothScaleWrapper">
          <div className="scaleWrapper">
            <div className="nameScaleWrapper">
              <p className="nameScale">Storage:</p>
              <div className="inputWrapper">
                <input
                  className="inputNumber"
                  type="number"
                  min="0"
                  max="1000"
                  onChange={changeStorageValue}
                  value={storage}
                />
                <p className="gbWord">GB</p>
              </div>
            </div>
            <div className="rangeWrapper">
              <div className="rangeBorder"></div>
              <input
                className="range"
                type="range"
                max="1000"
                onChange={changeStorageValue}
                value={storage}
              />
              <div className="rangeBorder"></div>
            </div>
            <div className="numberWrapper">
              <div className="number">0</div>
              <div className="number">1000</div>
            </div>
          </div>
          <div className="scaleWrapper">
            <div className="nameScaleWrapper">
              <p className="nameScale">Transfer:</p>
              <div className="inputWrapper">
                <input
                  className="inputNumber"
                  type="number"
                  min="0"
                  max="1000"
                  onChange={changeTransferValue}
                  value={transfer}
                />
                <p className="gbWord">GB</p>
              </div>
            </div>
            <div className="rangeWrapper">
              <div className="rangeBorder"></div>
              <input
                className="range"
                type="range"
                max="1000"
                onChange={changeTransferValue}
                value={transfer}
              />
              <div className="rangeBorder"></div>
            </div>
            <div className="numberWrapper">
              <div className="number">0</div>
              <div className="number">1000</div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div ref={bothScaleRef} className="bothScaleWrapper">
          <div className="scaleWrapper">
            <div className="nameScaleWrapper">
              <p className="nameScale">Storage:</p>
              <div className="inputWrapper">
                <input
                  className="inputNumber"
                  type="number"
                  min="0"
                  max="1000"
                  onChange={changeStorageValue}
                  value={storage}
                />
                <p className="gbWord">GB</p>
              </div>
            </div>
            <div className="rangeWrapper">
              <div className="rangeBorder"></div>
              <input
                className="range"
                type="range"
                max="1000"
                onChange={changeStorageValue}
                value={storage}
              />
              <div className="rangeBorder"></div>
            </div>
            <div className="numberWrapper">
              <div className="number">0</div>
              <div className="number">1000</div>
            </div>
          </div>
          <div className="scaleWrapper">
            <div className="nameScaleWrapper">
              <p className="nameScale">Transfer:</p>
              <div className="inputWrapper">
                <input
                  className="inputNumber"
                  type="number"
                  min="0"
                  max="1000"
                  onChange={changeTransferValue}
                  value={transfer}
                />
                <p className="gbWord">GB</p>
              </div>
            </div>
            <div className="rangeWrapper">
              <div className="rangeBorder"></div>
              <input
                className="range"
                type="range"
                max="1000"
                onChange={changeTransferValue}
                value={transfer}
              />
              <div className="rangeBorder"></div>
            </div>
            <div className="numberWrapper">
              <div className="number">0</div>
              <div className="number">1000</div>
            </div>
          </div>
        </div>

        <div ref={companyAndScheduleRef} className="companyAndScheduleWrapper">
          <div className="companyWrapper">
            <div className="nameCompanyWrapper">
              <div className="company">backblaze</div>
              <div className="companyAndOptionsWrapper">
                <div className="company">bunny</div>
                <input
                  onChange={changeRadioInput}
                  defaultChecked
                  className="inputRadio hdd"
                  type="radio"
                  name="hardDrive"
                />
                <span className="option">HDD</span>
                <input
                  onChange={changeRadioInput}
                  className="inputRadio ssd"
                  type="radio"
                  name="hardDrive"
                />
                <span className="option">SSD</span>
              </div>
              <div className="companyAndOptionsWrapper">
                <div className="company">scaleway</div>
                <input
                  onChange={changeRadioInput}
                  className="inputRadio multi"
                  type="radio"
                  name="quantity"
                />
                <span className="option">Multi</span>
                <input
                  onChange={changeRadioInput}
                  defaultChecked
                  className="inputRadio single"
                  type="radio"
                  name="quantity"
                />
                <span className="option">Single</span>
              </div>
              <div className="company">vultr</div>
            </div>
            <div className="imageCompanyWrapper">
              <img src={backblaze} alt="Backblaze" className="imageCompany" />
              <img src={bunny} alt="Bunny" className="imageCompany" />
              <img src={scaleway} alt="Scaleway" className="imageCompany" />
              <img src={vultr} alt="Vultr" className="imageCompany" />
            </div>
          </div>

          <div className="scheduleWrapper">
            <div className="startBorder"></div>
            <div className="linesWrapper">
              <div className="lineAndSumWrapper">
                <div ref={backblazeRef} className="line backblazeLine"></div>
                <span className="sum">{priceBacklaze}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={bunnyRef} className="line bunnyLine"></div>
                <span className="sum">{priceBunny}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={scalewayRef} className="line scalewayLine"></div>
                <span className="sum">{priceScaleway}$</span>
              </div>
              <div className="lineAndSumWrapper">
                <div ref={vultrRef} className="line vultrLine"></div>
                <span className="sum">{priceVultr}$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
