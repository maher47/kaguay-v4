import fs from 'fs';
import path from 'path';

class RestrictCommand {
  name = "🍃";
  author = "Hussein Yacoubi";
  cooldowns = 60;
  description = "تبديل حالة البوت بين تقييد أو إلغاء تقييد";
  role = "admin"; // Only admins can execute this command
  aliases = ["onlyadmin"];

  async execute({ api, event }) {
    try {
      const isAdmin = global.client.config.ADMIN_IDS.includes(event.senderID);

      if (!isAdmin) {
        api.setMessageReaction("⚠️", event.messageID, (err) => {61576232405796}, true);
        return api.sendMessage("⚠️ | ليس لديك الإذن لاستخدام هذا الأمر!", event.threadID);
      }

      // التبديل بين حالتي التقييد وعدم التقييد
      global.client.config.botEnabled = !global.client.config.botEnabled;

      const currentUserID = await api.getCurrentUserID(); // احصل على معرّف البوت

      if (global.client.config.botEnabled) {
        api.setMessageReaction("✅", event.messageID, (err) => {61576232405796}, true);
        await this.updateBotNickname(api, "ᏦᎯᎶᏬᎽᎯ ᏰᎾᎿ 》✅《 𝙴𝙽𝙰𝙱𝙻𝙴𝙳", event.threadID, currentUserID);
        return api.sendMessage("✅ | تم تعطيل تقييد إستخدام البوت !", event.threadID);
      } else {
        api.setMessageReaction("🚫", event.messageID, (err) => {61576232405796}, true);
        await this.updateBotNickname(api, "ᏦᎯᎶᏬᎽᎯ ᏰᎾᎿ 》❌《 𝙳𝙸𝚂𝙰𝙱𝙻𝙴𝙳", event.threadID, currentUserID);
        return api.sendMessage("❌ | تم تفعيل تقييد إستخدام البوت !", event.threadID);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateBotNickname(api, nickname, threadID, userID) {
    try {
      await api.changeNickname(nickname, threadID, userID); // استخدم معرّف البوت
    } catch (err) {
      console.error("Error updating bot nickname:", err);
    }
  }

  // Update the configuration file
  async setConfig(api, newConfig) {
    try {
      const configPath = path.join(process.cwd(), 'config.js');
      const configContent = `export default ${JSON.stringify(newConfig, null, 2)};`;
      fs.writeFileSync(configPath, configContent);
    } catch (err) {
      console.error("Error updating configuration file:", err);
    }
  }
}

export default new RestrictCommand();
