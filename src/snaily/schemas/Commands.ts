import { SlashCommandProps } from '../../types/client/cmd.types';

export class SlashBase {
    public props: SlashCommandProps;

    constructor(props: SlashCommandProps) {
        this.props = props;
    }
}