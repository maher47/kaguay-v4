import axios from 'axios';
import fs from 'fs';
import request from 'request';

export default {
  name: "مجموعتي",
  author: "ماهر فوكس (لـوﺴٌۦﻓ۪ۦﯿۦر) ",
  role: "member",
  description: "عرض معلومات عن المجموعة",
  aliases:["م_مج"],
  execute: async function ({ api, event }) {
    try {
      let threadInfo = await api.getThreadInfo(event.threadID);
      var memLength = threadInfo.participantIDs.length;
      var nameMen = [];
      var gendernam = [];
      var gendernu = [];
      var nope = [];
      for (let z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender;
        var nName = threadInfo.userInfo[z].name;
        if (gioitinhone == "MALE") { gendernam.push(z + gioitinhone) }
        else if (gioitinhone == "FEMALE") { gendernu.push(gioitinhone) }
        else { nope.push(nName) }
      };
      var nam = gendernam.length;
      var nu = gendernu.length;
      var listad = '';
      var qtv2 = threadInfo.adminIDs;
      let qtv = threadInfo.adminIDs.length;
      let sl = threadInfo.messageCount;
      let u = threadInfo.nicknames;
      let icon = threadInfo.emoji;
      let threadName = threadInfo.threadName;
      let id = threadInfo.threadID;
      for (let i = 0; i < qtv2.length; i++) {
        const infu = (await api.getUserInfo(qtv2[i].id));
        const name = infu[qtv2[i].id].name;
        listad += '•' + name + '\n';
      }
      let sex = threadInfo.approvalMode;
      var pd = sex == false ? 'تم تشغيلها' : sex == true ? 'تم تعطيلها' : 'loid';
      var callback = () =>
        api.sendMessage(
          {
            body: `◆❯━━━━━▣✦▣━━━━━━❮◆\n💫「 إسم المجموعة 」:${threadName}\n💫「 آيدي المجموعة 」: ${id}\n💫「 الموافقة 」: ${pd}\n💫「 الإيموجي 」: ${icon}\n💫「 معلومات 」: تتضمن ${memLength} أعضاء/عضو\n💫「 عدد الإناث 」: ${nam}\n💫「 عدد الذكور 」:  ${nu}\n💫「 إجمالي عدد المسؤولين 」: ${qtv} \n「 يتضمن 」:\n${listad}\n💫「 إجمال عدد الرسائل 」: ${sl} رسالة\n◆❯━━━━━▣✦▣━━━━━━❮◆`,
            attachment: fs.createReadStream(process.cwd() + '/cache/1.png')
          },
          event.threadID,
          () => fs.unlinkSync(process.cwd() + '/cache/1.png'),
          event.messageID
        );
      return request(encodeURI(`${threadInfo.imageSrc}`))
        .pipe(fs.createWriteStream(process.cwd() + '/cache/1.png'))
        .on('close', () => callback());
    } catch (error) {
      console.error(error);
      api.sendMessage(" ❌ |حدث خطأ أثناء جلب معلومات المجموعة.", event.threadID);
    }
  },
};
      
