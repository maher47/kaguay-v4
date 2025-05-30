export default {
  name: 'المطور', // اسم الأمر
  author: 'ماهر فوكس', // مؤلف الأمر
  role: 'member', // الدور المطلوب لاستخدام الأمر
  description: 'يعرض معلومات وجهة اتصال المطور.', // وصف الأمر
  aliases: ['مطور', 'المالك'],
  async execute({ api, event }) {
    try {
      const ownerInfo = {
        name: 'مــاهــر',
        gender: 'ذكر',
        age: '19',
        country: 'لــيــبــيــا 🇱🇾',
        height: '180',
        facebookLink: 'https://www.facebook.com/om.ar.511383',
        nick: 'لـوﺴٌۦﻓ۪ۦﯿۦر',
      };

      const ownerContactID = '61576232405796'; // معرّف المطور

      // رسالة المعلومات حول المطور
      const message = `࿇ ══━━━✥◈✥━━━══ ࿇
      •——[معلومات حول المالك]——•
      ❏ الاسم: 『${ownerInfo.name}』
      ❏ الجنس: 『${ownerInfo.gender}』
      ❏ العمر: 『${ownerInfo.age}』
      ❏ البلد: 『${ownerInfo.country}』
      ❏ الطول: 『${ownerInfo.height}』 سم
      ❏ رابط الفيسبوك: 『${ownerInfo.facebookLink}』
      ❏ اللقب:『${ownerInfo.nick}』\n ࿇ ══━━━✥◈✥━━━══ ࿇`;

      // إرسال رسالة المعلومات
      await api.sendMessage(message, event.threadID);

      // مشاركة جهة الاتصال الخاصة بالمطور
      await api.shareContact(ownerContactID, ownerContactID, event.threadID);

      // إضافة تفاعل مع الرسالة كإشارة على النجاح
      api.setMessageReaction('🚀', event.messageID, (err) => {}, true);
    } catch (error) {
      console.error('حدث خطأ أثناء تنفيذ الأمر:', error);
      api.sendMessage('⚠️ حدث خطأ أثناء معالجة الأمر.', event.threadID);
    }
  },
};
