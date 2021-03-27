import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UAParser from 'ua-parser-js';
import SocialSignIns from './social-sign-ins';
import './security.scss';

const DeviceKindMap = {
  audioinput: "Audio Input",
  audiooutput: "Audio Output",
  videoinput: "Video Input"
};

function Security() {

  const [mediaDevices, setMediaDevices] = useState([]);
  const [batteryInfo, setBatteryInfo] = useState({});
  const [ipInfo, setIpInfo] = useState(null);
  const [loginStatus, setLoginStatus] = useState({});

  useEffect(() => {
    getConnectedMediaDevices();
    getBatteryInfo();
    getIpInfo();
  }, [setMediaDevices, setBatteryInfo, setIpInfo]);

  const updateLoginStatus = (service, status) => {
    setLoginStatus({ ...loginStatus, [service]: status });
  };

  const getIpInfo = () => {
    fetch('https://ipapi.co/json/')
      .then(function (response) {
        response.json().then(jsonData => {
          setIpInfo(jsonData);
        });
      })
      .catch(function (error) {
        console.log(error)
      });
  };

  const getBatteryInfo = () => {
    if (typeof navigator.getBattery === "function") {
      navigator.getBattery().then(function (battery) {
        setBatteryInfoProcessed(battery);

        battery.onchargingchange = function () {
          setBatteryInfoProcessed(battery);
        };

        battery.onlevelchange = function () {
          setBatteryInfoProcessed(battery);
        };

        battery.ondischargingtimechange = function () {
          setBatteryInfoProcessed(battery);
        };
      });
    }
  };

  const setBatteryInfoProcessed = (battery) => {
    let dischargingTime = null;
    let chargingTime = null;

    if (!battery.charging) {
      dischargingTime = (battery.dischargingTime === Infinity ? 'Infinity' : (Math.round(100 * battery.dischargingTime / 3600) / 100) + 'h');
    } else {
      chargingTime = (battery.chargingTime === Infinity ? 'Infinity' : (Math.round(100 * battery.chargingTime / 3600) / 100) + 'h');
    }

    setBatteryInfo({
      status: battery.charging ? "Charging" : "Discharging",
      dischargingTime,
      chargingTime,
      level: Math.round(battery.level * 10000) / 100 + "%"
    });
  };

  const getGPUInfo = () => {
    let canvas = document.getElementById("mycanvas");
    let gl;
    let vendor = "";
    let renderer = "";
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (gl) {
      let extension = gl.getExtension('WEBGL_debug_renderer_info');

      if (extension) {
        vendor = gl.getParameter(extension.UNMASKED_VENDOR_WEBGL);
        renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
      } else {
        vendor = gl.getParameter(gl.VENDOR);
        renderer = gl.getParameter(gl.RENDERER);
      }
    }
    return { vendor, renderer };
  };

  const getCPUInfo = () => {
    const cpu = navigator.platform;
    const cores = navigator.hardwareConcurrency + ' Cores';

    return { cpu, cores };
  };

  const getConnectedMediaDevices = () => {

    const promise = navigator.mediaDevices.enumerateDevices();
    promise.then(function (devices, index) {
      const deviceList = [];
      devices.forEach(({ deviceId, label, kind }) => {
        if (deviceId !== "default") {
          deviceList.push({
            id: index,
            label,
            kind,
          })
        }
      });
      setMediaDevices(deviceList);
    });
  };

  const getMediaDevicesView = () => {
    if (mediaDevices.length) {
      const deviceViews = [];
      mediaDevices.forEach(({ label, kind, id }) => {
        deviceViews.push(<div className="sec-sub-item"
                              key={id}>
          <span>{`${DeviceKindMap[kind]} - `}</span>{label ? label : "Permission" +
          " denied"}</div>);
      });

      return <div className="sec-item-container">
        <div className="sec-item-header">Media Devices</div>
        <div className="sec-item-body">
          {deviceViews}
        </div>
      </div>
    }
    return null;
  };

  const getPluginsView = () => {
    const plugins = navigator.plugins;
    if (plugins.length) {
      const views = [];
      for (let i = 0; i < plugins.length; i += 1) {
        const { id, name } = plugins[i];
        views.push(<div className="sec-sub-item" key={id}>{name}</div>);
      }

      return <div className="sec-item-container">
        <div className="sec-item-header">Plugins</div>
        <div className="sec-item-body">
          {views}
        </div>
      </div>
    }
    return null;
  };

  const getLoginStatusView = () => {
    if (Object.keys(loginStatus).length) {
      const services = Object.keys(loginStatus);
      const views = [];

      for (let i = 0; i < services.length; i += 1) {
        views.push(<div className="sec-sub-item" key={i}>
          <span>{`${services[i]} - `}</span>{loginStatus[services[i]] ? "Logged" +
          " in" : "Logged out"}</div>);
      }

      return <div className="sec-item-container">
        <div className="sec-item-header">Social</div>
        <div className="sec-item-body">
          {views}
        </div>
      </div>
    }
    return null;
  };

  const getSoftwareView = () => {
    const userAgentStr = navigator.userAgent;
    const { browser, os } = UAParser(userAgentStr);

    return <div className="sec-item-container">
      <div className="sec-item-header">Software</div>
      <div className="sec-item-body">
        <div className="sec-sub-item"><span>{`${browser.name} - `}</span>{`${browser.version}`}
        </div>
        <div className="sec-sub-item"><span>{`${os.name} - `}</span>{`${os.version}`}</div>
      </div>
    </div>
  };

  const getIpInfoView = () => {
    if (ipInfo) {
      const { ip, city, country_name, region, postal, org, latitude, longitude } = ipInfo;

      return <div className="sec-item-container">
        <div className="sec-item-header">Location</div>
        <div className="sec-item-body">
          <div className="sec-sub-item"><span>IP - </span>{`${ip}`}</div>
          <div className="sec-sub-item"><span>Country - </span>{`${country_name}`}</div>
          <div className="sec-sub-item"><span>Region - </span>{`${region}`}</div>
          <div className="sec-sub-item"><span>City - </span>{`${city}`}</div>
          <div className="sec-sub-item"><span>Postal Code - </span>{`${postal}`}</div>
          <div className="sec-sub-item"><span>Latitude - </span>{`${latitude}`}</div>
          <div className="sec-sub-item"><span>Longitude - </span>{`${longitude}`}</div>
          <div className="sec-sub-item"><span>ISP - </span>{`${org}`}</div>
        </div>
      </div>
    }
    return null;
  };

  const getHardwareView = () => {
    const { renderer, vendor } = getGPUInfo();
    const { cpu, cores } = getCPUInfo();
    const { status, dischargingTime, chargingTime, level } = batteryInfo;

    return <div className="sec-item-container">
      <div className="sec-item-header">Hardware</div>
      <div className="sec-item-body">
        {cpu ? <div className="sec-sub-item"><span>CPU - </span>{`${cpu}`}</div> : null}
        {cores ? <div className="sec-sub-item"><span>Cores - </span>{`${cores}`}</div> : null}
        <div className="sec-sub-item-br" />
        {vendor ?
          <div className="sec-sub-item"><span>GPU Vendor - </span>{`${vendor}`}</div> : null}
        {renderer ?
          <div className="sec-sub-item"><span>Renderer - </span>{`${renderer}`}</div> : null}
        <div
          className="sec-sub-item">
          <span>Display - </span>{`${window.screen.width} x ${window.screen.height} - ${window.screen.colorDepth}bits/pixel`}
        </div>
        <div className="sec-sub-item-br" />
        {status ? <div className="sec-sub-item"><span>Battery - </span>{`${status}`}</div> : null}
        {level ? <div className="sec-sub-item"><span>Level - </span>{`${level}`}</div> : null}
        {dischargingTime ?
          <div className="sec-sub-item"><span>Time Remaining - </span>{`${dischargingTime}`}
          </div> : null}
        {chargingTime ?
          <div className="sec-sub-item"><span>Charging Time - </span>{`${chargingTime}`}
          </div> : null}
      </div>
    </div>
  };

  const getPreventionView = () => {
    return <div className="prevention-section-cont">
      <div className="psc-header">To prevent your browser from</div>
      <div className="psc-item">leaking your ip and location, use a <span className="sol">Webproxy</span></div>
      <div className="psc-item">leaking information about your software, use <span className="sol">NoScript</span></div>
      <div className="psc-item">leaking device information, use <span className="sol">Noscript</span></div>
      <div className="psc-item">leaking information about your connection, use <span className="sol">Noscript</span>, a <span className="sol">Webproxy</span></div>
      <div className="psc-item">leaking information about your social networks, use <span className="sol">Private Browsing</span></div>
      <div className="psc-item">scanning your Network, use <span className="sol">Noscript</span></div>
    </div>
  };

  return <div className="security-container">
    <div className="sec-header">Are you exposed?</div>
    <div className="sec-sub-header">This is to demonstrate how your personal data can be accessed by
      any website without you knowing it. This is just for the purpose of education; data may be
      inaccurate.
    </div>
    {getSoftwareView()}
    {getHardwareView()}
    {getIpInfoView()}
    {getLoginStatusView()}
    {getPluginsView()}
    {getMediaDevicesView()}
    {getPreventionView()}
    <SocialSignIns informLoginStatus={updateLoginStatus} />
  </div>;
}

Security.propTypes = {};

Security.defaultProps = {};

export default Security;


