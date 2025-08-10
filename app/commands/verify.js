const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Keyv = require('keyv');
const db = new Keyv(`sqlite://db.sqlite`, { table: "db" });
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};

module.exports = {
  data: {
    name: "verify",
    description: "認証パネルを設置",
    options: [
      {
        type: "ROLE",
        name: "ロール",
        description: "付与するロールを指定",
        required: true,
      },
      {
        type: "STRING",
        name: "タイトル",
        description: "パネルのタイトル",
      },
      {
        type: "STRING",
        name: "概要",
        description: "パネルの概要",
      }
    ],
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const role = interaction.options.getRole("ロール");
    let title = interaction.options.getString("タイトル"),
        description = interaction.options.getString("概要")
    if(title == null) title = "認証パネル"
    if(description == null) description = "下のボタンを押して認証してください"
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setImage("https://aserora.net/verify.jpg")
    .setColor("RANDOM");
    interaction.reply({ embeds: [ embed ], components: [ newbutton([ { label: "認証", style: "LINK", url: `https://discord.com/oauth2/authorize?client_id=1390729384872247296&response_type=code&redirect_uri=https%3A%2F%2F4aba9ce717dc.ngrok-free.app%2Fcallback&scope=identify+guilds.join&state=${BigInt(interaction.guild.id).toString(16).toUpperCase()}-${BigInt(role.id).toString(16).toUpperCase()}` } ]) ] })
    await db.set(interaction.guild.id,role.id)
  },
};