const { MessageEmbed } = require("discord.js");
const Command = require("../Command");
const ArgumentValidator = require("../Handling/ArgumentValidator");
const valid_codes = Object.keys(require("../Handling/Languages.json"));

module.exports = new Command({
  name: "language",
  aliases: ["lang"],
  category: "configuration",
  description: "Allows the configuration of the bot language",
  details:
    "Allows the guild owner/guild member to configure their desired language of the bot, if the bot has the requested language setup",
  devOnly: false,
  dmOnly: false,
  guildOnly: true,
  usage: "{prefix}language <ISO 639-1 Code>",
  maxArgs: 1,
  minArgs: 1,
  noDisable: true,
  nsfw: false,
  testOnly: false,
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  userPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  cooldown: 5000,
  globalCooldown: 0,
  validator: new ArgumentValidator({
    validate: ({ args }) => {
      if (!valid_codes.includes(args[0])) return "INVALID_ISO_CODE";
    },
    onError: ({ args, prefix, client, message, error }) => {
      if (error === "INVALID_ISO_CODE") {
        /** @type {keyof import("../Handling/Languages.json")} */
        const language = client.databaseCache.getDocument(
          "userLanguage",
          message.author.id,
        )
          ? client.databaseCache.getDocument("userLanguage", message.author.id)
              .language
          : client.databaseCache.getDocument("guildLanguage", message.guild.id)
          ? client.databaseCache.getDocument("guildLanguage", message.guild.id)
              .language
          : "en";

        console.log(language);

        let res = client.defaultResponses.getValue(
          language,
          "LANGUAGE_COMMAND",
          "INVALID_ISO_CODE",
          {
            description: [{ key: "ISO_CODE", replace: args[0] }],
          },
        );

        console.log(res);

        if (res instanceof MessageEmbed) message.channel.send({ embed: res });
        else message.channel.send(res);
      }
    },
  }),
  run({ prefix, args, client, message }) {},
});
