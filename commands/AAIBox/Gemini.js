import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: "شوتي",
  author: "Jonnell maggalina",
  role: "member",
  aliases: ["shoti"],
  description: "جلب مقطاطع فتيات يرقصن في التيك توك",

  async execute({ api, event }) {
    const { threadID, messageID, senderID } = event;

    try {
      // إرسال رسالة الانتظار
      const waitMessage = await api.sendMessage("⏱️ | جاري البحث عن مقطع شوتي، يرجى الانتظار...", threadID);

      // طلب البيانات من API الجديد
      try {
        const response = await axios.get("https://joncll.serv00.net/shotiapi.php");
        const { url: videoUrl, cover: coverUrl, title, duration, region, user } = response.data.data;
        const { username, nickname } = user;

        // مسار تخزين صورة الغلاف مؤقتًا
        const imagePath = path.resolve(process.cwd(), 'shoti_cover.jpg');
        const imageResponse = await axios({
          url: coverUrl,  // استخدام صورة الغلاف من الـ API
          method: 'GET',
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(writer);

        writer.on('finish', () => {
          // حذف رسالة الانتظار
          api.unsendMessage(waitMessage.messageID);

          // إرسال صورة الغلاف مع العنوان وطلب الرد بتم
          api.sendMessage({
            body: `🎬 | الـعـنـوان : ${title || "غير متوفر"}\n⏳ | الـمـدة: ${duration}\n👤 | الـإسـم : ${username}\n💬 | الـلـقـب : ${nickname}\n🌍 | الـمـنـطـقـة: ${region}\n\n 🔖 | الرجاء الرد بـ "تم" لتحميل الفيديو.`,
            attachment: fs.createReadStream(imagePath)
          }, threadID, (err, info) => {
            if (err) return console.error("Error sending cover image:", err);

            // تخزين البيانات للرد باستخدام onReply
            global.client.handler.reply.set(info.messageID, {
              author: senderID,
              type: "pick",
              name: "شوتي", // اسم الكود
              videoUrl,
              title,
              duration,
              username,
              nickname,
              region,
              unsend: true
            });

            // حذف الصورة المؤقتة بعد الإرسال
            fs.unlinkSync(imagePath);
          }, messageID);
        });

        writer.on('error', (err) => {
          console.error('Error writing cover image file:', err);
          api.sendMessage("⚠️ | حدث خطأ أثناء كتابة ملف الصورة.", threadID, messageID);
        });

      } catch (error) {
        console.error('Error fetching Shoti API:', error.message);

        api.setMessageReaction("⬇️", event.messageID, (err) => {}, true);
        api.unsendMessage(waitMessage.messageID);
        api.sendMessage(`⚠️ | حدث خطأ أثناء استدعاء API!\n${error.message}`, threadID, messageID);
      }

    } catch (error) {
      console.error('Error executing Shoti command:', error.message);
      api.sendMessage(`⚠️ | حدث خطأ أثناء التنفيذ!\n${error.message}`, threadID, messageID);
    }
  },

  async onReply({ api, event, reply }) {
    const { author, videoUrl, title, duration, username, nickname, name, region } = reply;

    // التحقق من أن الشخص الذي يرد هو نفس الشخص الذي أرسل الأمر الأصلي
    if (reply.type === "pick" && event.senderID === author && name === "شوتي") {
      if (event.body.trim().toLowerCase() === "تم") {
        const { threadID, messageID } = event;

        try {
          // مسار تخزين الفيديو مؤقتًا
          const videoPath = path.resolve(process.cwd(), 'shoti_video.mp4');
          const writer = fs.createWriteStream(videoPath);

          // تحميل الفيديو
          const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
          });

          response.data.pipe(writer);

          writer.on('finish', () => {
            // إرسال الفيديو مع المعلومات
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);

            api.sendMessage({
              body: `✅ | تـم تـحـمـيـل مـقـطـع شـوتـي \n🎬 | الـعـنـوان: ${title || "غير متوفر"}\n⏳ | الـمـدة: ${duration}\n👤 | الـإسـم: ${username}\n💬 | الـلـقـب: ${nickname}\n🌍 | الـمـنـطـقـة: ${region}`,
              attachment: fs.createReadStream(videoPath)
            }, threadID, () => fs.unlinkSync(videoPath), messageID);
          });

          writer.on('error', (err) => {
            console.error('Error writing video file:', err);
            api.sendMessage("⚠️ | حدث خطأ أثناء كتابة ملف الفيديو.", threadID, messageID);
          });

        } catch (error) {
          console.error('Error downloading video:', error.message);
          api.sendMessage("⚠️ | حدث خطأ أثناء تحميل الفيديو.", threadID, messageID);
        }

      } else {
        api.sendMessage("⚠️ | يرجى الرد بكلمة 'تم' لتحميل الفيديو.", event.threadID, event.messageID);
      }
    }
  }
};
