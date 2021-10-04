const axios = require("axios");
const link = "https://arugaz.herokuapp.com";
const fileyt =
  "https://raw.githubusercontent.com/ArugaZ/scraper-results/main/20201111_230923.jpg";
const eroryt =
  "https://raw.githubusercontent.com/ArugaZ/scraper-results/main/20201111_234624.jpg";

const cekzodiak = async (nama, tgl, bln, thn) =>
  new Promise((resolve, reject) => {
    axios
      .get(
        `${link}/api/getzodiak?nama=${nama}&tgl-bln-thn=${tgl}-${bln}-${thn}`
      )
      .then((res) => {
        const text = `Nama: ${res.data.nama}\nusia: ${res.data.usia}\nZodiak: ${res.data.zodiak}`;
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });

const quote = async () =>
  new Promise((resolve, reject) => {
    axios
      .get(`${link}/api/randomquotes`)
      .then((res) => {
        const text = `Author: ${res.data.author}\n\nQuote: ${res.data.quotes}`;
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });

const wiki = async (url) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${link}/api/wiki?q=${url}`)
      .then((res) => {
        resolve(res.data.result);
      })
      .catch((err) => {
        reject(err);
      });
  });

const jadwaldaerah = async (url) =>
  new Promise((resolve, reject) => {
    axios
      .get(`https://api.myquran.com/v1/sholat/kota/cari/${url}`)
      .then((res) => {
        if (!res.data.status) {
          resolve(res.data.message);
        } else {
          let date = new Date();
          axios
            .get(
              `https://api.myquran.com/v1/sholat/jadwal/${
                res.data.data[0].id
              }/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            )
            .then((res) => {
              const text = `Jadwal Sholat ${res.data.data.lokasi}\npada ${res.data.data.jadwal.tanggal}\n\nSubuh: ${res.data.data.jadwal.subuh}\nDzuhur: ${res.data.data.jadwal.dzuhur}\nAshar: ${res.data.data.jadwal.ashar}\nMaghrib: ${res.data.data.jadwal.maghrib}\nIsya: ${res.data.data.jadwal.isya}`;
              resolve(text);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });

const tulis = async (teks) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${link}/api/nulis?text=${encodeURIComponent(teks)}`)
      .then((res) => {
        resolve(`${res.data.result}`);
      })
      .catch((err) => {
        reject(err);
      });
  });

const qrcode = async (url, size) =>
  new Promise((resolve, reject) => {
    axios
      .get(
        `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=${size}x${size}`
      )
      .then((res) => {
        resolve(
          `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=${size}x${size}`
        );
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  quote,
  wiki,
  jadwaldaerah,
  tulis,
  cekzodiak,
  qrcode,
};
