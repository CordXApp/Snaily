import { EmbedBuilder, HexColorString, EmbedField, EmbedAuthorOptions, EmbedAuthorData } from "discord.js"

/**
 * @file EmbedBuilder - EmbedBuilder class
 */
export class SnailyEmbed extends EmbedBuilder {
    /**
     * @param {string} title - Embed's title
     * @param {string} description - Embed's description
     * @param {string} color - Embed's color
     */
    constructor(data: {
        title: string
        description: string
        image?: string
        thumbnail?: string
        color: HexColorString
        fields?: EmbedField[]
        author?: EmbedAuthorOptions
    }) {
        super()

        this.setTitle(data.title)
        this.setDescription(data.description)
        if (data.image) this.setImage(data.image)
        if (data.author) this.setAuthor({
            name: data.author.name,
            iconURL: data.author.iconURL,
            url: data.author.url
        })
        this.setThumbnail(
            data.thumbnail
                ? data.thumbnail
                : "https://cordximg.host/users/510065483693817867/e8HJKF6N.png",
        )
        this.setColor(data.color)
        if (data.fields) this.setFields(data.fields)
        this.setTimestamp()
        this.setFooter({
            text: "© Copyright 2024 - Infinity Development",
            iconURL: "https://cordximg.host/users/510065483693817867/e8HJKF6N.png"
        })
    }
}