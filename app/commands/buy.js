const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const path = require('path');

module.exports = {
    data: {
        name: "buy",
        description: "バックアップ用パスワードを発行します",
    },
    async execute(interaction) {
        const configPath = path.join(process.cwd(), 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const embed = new MessageEmbed()
            .setTitle("パスワード発行")
            .setDescription("下のボタンを押すと、あなた専用のバックアップ実行パスワードを発行します。")
            .setColor("GOLD");

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('generate_pass')
                .setLabel('パスワードを発行する')
                .setStyle('PRIMARY')
        );

        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // ボタンのインタラクションを受け取る
        const filter = i => i.customId === 'generate_pass' && i.user.id === interaction.user.id;
        
        collector.on('collect', async i => {
            // 8桁のランダムな英数字を生成
            const newPassword = Math.random().toString(36).slice(-8);
            
            // configの更新
            const currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            
            // 既存のユーザーがいれば上書き、いなければ追加
            const userIdx = currentConfig.user_passwords.findIndex(p => p.userId === i.user.id);
            if (userIdx > -1) {
                currentConfig.user_passwords[userIdx].pass = newPassword;
            } else {
                currentConfig.user_passwords.push({ userId: i.user.id, pass: newPassword });
            }

            fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));

            await i.reply({ 
                content: `あなた専用パスワードを発行しました： \`${newPassword}\` \nこのパスワードは他人には教えないでください。`, 
                ephemeral: true 
            });
        });
    }
};