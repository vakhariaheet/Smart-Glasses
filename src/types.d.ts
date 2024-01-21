export interface TPVDATA {
    class: string;
    device: string;
    mode: number;
    time: string;
    ept: number;
    lat: number;
    lon: number;
    altHAE: number;
    altMSL: number;
    alt: number;
    epx: number;
    epy: number;
    epv: number;
    track: number;
    magtrack: number;
    magvar: number;
    speed: number;
    climb: number;
    eps: number;
    epc: number;
    geoidSep: number;
    eph: number;
    sep: number;
}
export interface GGADate {
  time: string;
  lat: number;
  lon: number;
  alt: number;
  quality: string;
  satellites: number;
  hdop: number;
  geoidal: number;
  age?: any;
  stationID?: any;
  raw: string;
  valid: boolean;
  type: string;
}