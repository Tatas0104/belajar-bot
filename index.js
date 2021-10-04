const wa = require("@open-wa/wa-automate");
const KBBI = require("kbbi.js");
const fetch = require("node-fetch");
const axios = require("axios");
const tatasapi = require("./lib/index");
const translate = require("@vitalets/google-translate-api");
wa.create().then((Client) => start(Client));

function start(client) {
  client.onMessage(async (message) => {
    const quotedMsg = message.quotedMsg;
    const api = tatasapi.tatasapi;
    const args = message.body.trim().split(" ");
    const prefix = "#";
    const id = message.id;
    const menu = [
      "tagall",
      "kbbi",
      "covid",
      "listsurah",
      "katabijak",
      "pantun",
      "anime",
      "quote",
      "wiki",
      "jsolat",
      "nulis",
      "zodiak",
      "qrcode",
      "translate",
    ];
    const reply = async (txt, qId = message.id) => {
      return client.reply(message.from, txt, qId).catch((e) => {
        console.log(e);
      });
    };
    if (message.body === `${prefix}tagall`) {
      try {
        const groupMem = await client.getGroupMembers(message.from);
        let res = `✪〘 Mention All 〙✪\n------------------\n`;
        for (let m of groupMem) {
          res += "╠➥ ";
          console.log(m);
          res += `@${m.id.replace(/@c\.us/g, "")}\n`;
        }
        res += "╚═〘 *Tatas  B O T* 〙";
        await client.sendText(message.from, res);
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}kbbi`) {
      if (args.length == 2) {
        KBBI.cari(args[1])
          .then((res) => {
            let result = "";
            for (let i = 0; i < res["arti"].length; i++) {
              result += `${i + 1}.${res["arti"][i]}\n`;
            }
            reply(result);
          })
          .catch((e) => {
            reply(`---error---\n${e}`);
          });
      } else {
        reply(`harus berformat kbbi *(kata)* \n*contoh:${prefix}kbbi apel*`);
      }
    } else if (args[0].toLowerCase() === `${prefix}covid`) {
      //covid 19
      try {
        let result = "╔══✪〘 List Data covid  〙✪══\n";
        fetch(
          "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
        )
          .then((res) => res.json())
          .then((data) => {
            for (let i = 0; i < 34; i++) {
              let index = data.features[i].attributes;
              result += "╠➥ ";
              result += `*${i + 1}.${index.Provinsi}*\n`;
              result += `   kasus positive=${index.Kasus_Posi} orang\n`;
              result += `   kasus sembuh=${index.Kasus_Semb} orang\n`;
              result += `   kasus meninggal=${index.Kasus_Meni} orang\n`;
            }
            result += "╚═〘 *Tatas  B O T* 〙";
            reply(result);
          });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}listsurah`) {
      try {
        axios
          .get(
            "https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json"
          )
          .then((response) => {
            let hehex = "╔══✪〘 List Surah 〙✪══\n";
            for (let i = 0; i < response.data.data.length; i++) {
              hehex += "╠➥ ";
              hehex +=
                response.data.data[i].name.transliteration.id.toLowerCase() +
                "\n";
            }
            hehex += "╚═〘 *Tatas  B O T* 〙";
            reply(hehex);
          });
      } catch (err) {
        reply(err);
      }
    } else if (args[0].toLowerCase() === `${prefix}katabijak`) {
      try {
        fetch(
          "https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt"
        )
          .then((res) => res.text())
          .then((body) => {
            let splitbijak = body.split("\n");
            let randombijak =
              splitbijak[Math.floor(Math.random() * splitbijak.length)];
            reply(randombijak);
          })
          .catch(() => {
            reply("ada yang error");
          });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}pantun`) {
      try {
        fetch(
          "https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt"
        )
          .then((res) => res.text())
          .then((body) => {
            let splitpantun = body.split("\n");
            let randompantun =
              splitpantun[Math.floor(Math.random() * splitpantun.length)];
            reply(randompantun.replace(/aruga-line/g, "\n"));
          })
          .catch(() => {
            reply("Ada yang Error!");
          });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}anime`) {
      if (args.length == 1) {
        return reply(
          `Untuk menggunakan ${prefix}anime\nSilahkan ketik: ${prefix}anime [query]\nContoh: ${prefix}anime random\n\nquery yang tersedia:\nrandom, waifu, husbu, neko`
        );
      }
      if (
        args[1].toLowerCase() == "random" ||
        args[1].toLowerCase() == "waifu" ||
        args[1].toLowerCase() == "husbu" ||
        args[1].toLowerCase() == "neko"
      ) {
        try {
          fetch(
            "https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/" +
              args[1].toLowerCase() +
              ".txt"
          )
            .then((res) => res.text())
            .then((body) => {
              let randomnime = body.split("\n");
              let randomnimex =
                randomnime[Math.floor(Math.random() * randomnime.length)];
              client.sendFileFromUrl(
                message.from,
                randomnimex,
                "",
                `${args[1].toLowerCase()}`,
                message.id
              );
            })
            .catch(() => {
              reply("Ada yang Error!");
            });
        } catch (e) {
          console.log(e);
        }
      } else {
        reply(
          `Maaf query tidak tersedia. Silahkan ketik ${prefix}anime untuk melihat list query`
        );
      }
    } else if (args[0].toLowerCase() === `${prefix}quote`) {
      const quotex = await api.quote();
      await reply(quotex).catch(() => {
        reply("Ada yang Error!");
      });
    } else if (args[0].toLowerCase() === `${prefix}wiki`) {
      try {
        if (args.length <= 1) {
          return reply(
            `Untuk mencari suatu kata dari wikipedia\nketik: ${prefix}wiki [kata]`
          );
        }
        const wikip = message.body.slice(5 + prefix.length);
        const wakis = await api.wiki(wikip);

        await reply(wakis.replace("ArugaZ", "Tatas07")).catch(() => {
          reply("Ada yang Error!");
        });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}jsolat`) {
      if (args.length <= 1) {
        return reply(
          `Untuk melihat jadwal solat dari setiap daerah yang ada\nketik: ${prefix}jsolat [daerah]`
        );
      }
      const solatx = message.body.slice(7 + prefix.length);
      const solatj = await api.jadwaldaerah(solatx);
      await reply(solatj).catch(() => {
        reply("Pastikan daerah kamu ada di list ya!");
      });
    } else if (args[0].toLowerCase() === `${prefix}nulis`) {
      try {
        if (args.length <= 1) {
          return reply(
            `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis i love you 3000`
          );
        }
        const nulisq = message.body.slice(6 + prefix.length);
        const nulisp = await api.tulis(nulisq);
        await client
          .sendImage(message.from, `${nulisp}`, "", "Nih...", id)
          .catch(() => {
            reply("Ada yang Error!");
          });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}zodiak`) {
      try {
        if (args.length != 5) {
          return reply(
            `Untuk mengecek zodiak, gunakan ${prefix}zodiak nama tanggallahir bulanlahir tahunlahir\nContoh: ${prefix}cekzodiak fikri 13 06 2004`
          );
        }
        const cekzodiak = await api.cekzodiak(
          args[1],
          args[2],
          args[3],
          args[4]
        );
        await reply(cekzodiak).catch(() => {
          reply("Ada yang Error!");
        });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}qrcode`) {
      try {
        if (args.length != 3)
          return reply(
            `Untuk menggunakan fitur qrcode, ketik :\n${prefix}qrcode [kata/url] [size]\n\nContoh: ${prefix}qrcode https://google.com 300\n\n*Size minimal 100 & maksimal 500*`
          );
        reply(`wait...`);
        api.qrcode(args[1], args[2]).then(async (res) => {
          await client.sendFileFromUrl(message.from, `${res}`, id);
        });
      } catch (e) {
        console.log(e);
      }
    } else if (args[0].toLowerCase() === `${prefix}menu`) {
      result = "╔══✪〘 List Menu Bot  〙✪══\n";
      for (let i = 0; i < menu.length; i++) {
        result += "╠➥ ";
        result += `${prefix}${menu[i]}\n`;
      }
      result += "=> fitur akan terus di tambah <=";
      reply(result);
    } else if (args[0].toLowerCase() === `${prefix}translate`) {
      try {
        if (args.length != 2) {
          return reply(
            `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`
          );
        }
        if (!quotedMsg) {
          return reply(
            `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`
          );
        }
        const quoteText =
          quotedMsg.type == "chat"
            ? quotedMsg.body
            : quotedMsg.type == "image"
            ? quotedMsg.caption
            : "";
        translate(quoteText, { to: args[1] })
          .then((res) => {
            reply(
              `${res.text}\n\n*${res.from.language.iso}<<<<=======>>>${args[1]}*`
            );
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (e) {
        console.log(e);
      }
    }else if (args[0].toLowerCase() === '='){
      if (args.length<=1) {
      reply("contoh format yang benar adalah\n=100 + 124")
    }
    try{
      let i=eval(message.body.slice(2));
      reply(`*hasil=${i}*`)
    }catch(e){
      console.log(e)
    }
    }
  });
}
