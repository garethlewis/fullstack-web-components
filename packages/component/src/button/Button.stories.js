import {ButtonComponent} from "./Button";
import {html} from "lit-html";

export default {
    title: "Components/Inputs/Button",
    component: 'in-button',
};

const Template = ({ label, variant }) => html`
    <button class="${variant}" is="in-button">
        ${label}
    </button>
`;

export const Primary = Template.bind({});
Primary.args = {
    variant: "primary",
    label: "Button"
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: "secondary",
    label: "Button"
}

const IconTemplate = ({label, variant, svg}) => html`
    <button 
            class="${variant}"
            aria-labelledby="close-button-label"
            is="in-button"
    >
        <span id="close-button-label" hidden>${label}</span>
        ${svg}
    </button>
`;

let icon = null;

if (window.FontAwesome) {
    icon = window.FontAwesome.icon({prefix: "fas", iconName: "plus"});
}

const svg = icon.node[0];
svg.setAttribute('aria-hidden', 'true');

export const Icon = IconTemplate.bind({});
Icon.args = {
    variant: "icon icon-close",
    label: 'Close',
    svg: svg,
}

const DisabledTemplate = ({label, variant}) => html`
    <button class="${variant}" is="in-button" disabled>
        ${label}
    </button>
`;

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
    variant: "primary",
    label: "Submit"
};
