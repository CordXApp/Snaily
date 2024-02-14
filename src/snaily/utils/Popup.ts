import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } from 'discord.js';
import Snaily from "../client";


export class SnailyModal extends ModalBuilder {
    public client = Snaily;
    public modal: ModalBuilder = new ModalBuilder();
    public text1: TextInputBuilder = new TextInputBuilder();
    public text2: TextInputBuilder = new TextInputBuilder();
    public row1: ActionRowBuilder = new ActionRowBuilder();
    public row2: ActionRowBuilder = new ActionRowBuilder();
    public selectMenu: StringSelectMenuBuilder = new StringSelectMenuBuilder();

    constructor() {
        super();
    }

    public async updateReportModal() {
        const modal = this.modal
            .setCustomId("updateReport")
            .setTitle("Add a note to the report.")

        const note = this.text2
            .setCustomId("reportNote")
            .setLabel("Type your note here. (200-2000 characters)")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(200)
            .setMaxLength(2000)

        const actionRow = this.row1.addComponents(note)

        modal.addComponents(actionRow as any)

        return modal;
    }
}