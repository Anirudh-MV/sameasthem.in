import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
	classicThemeIcon,
	darkThemeIcon,
} from './icons';

const themes = {
	default: {
		name: 'default',
		icon: darkThemeIcon,
		label: 'Classic',
	},
	dark: {
		name: 'dark',
		icon: classicThemeIcon,
		label: 'Dark',
	},
};

@customElement('theme-switcher')
export class ThemeSwitcher extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
			button {
				display: inline-flex;
				outline: none;
				border: none;
				background-color: transparent;
				border: 2px solid transparent;
				border-radius: 20rem;
				padding: 1px;
				cursor: pointer;
				transition: border var(--theme-transition);
			}
			button[active] {
				border: 2px solid var(--theme-primary);
				box-shadow: 0 0 12px 1px var(--theme-primary);
			}
			button:hover {
				border: 2px solid var(--theme-primary);
			}
			.theme-switcher__container {
				margin: 2rem 0;
				display: grid;
			}
			.theme-select__container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.theme-select__container p {
				font-size: var(--font-size-sm);
			}
		`,
	];

	// set the _doc element
	private _doc = document.firstElementChild;

	@property({ type: String })
	theme: string | null = null;

	private _getCurrentTheme() {
		// check for a local storage theme first
		const localStorageTheme = localStorage.getItem('theme');
		if (localStorageTheme !== null) {
			this._setTheme(localStorageTheme);
		} else {
			// Set default theme to dark if the operating system specifies this preference
			if (
				window.matchMedia &&
				window.matchMedia('(prefers-color-scheme: dark)').matches
			) {
				this._setTheme('dark');
			} else {
				// Set to default/light theme if no specification, or light theme is specified
				this._setTheme('default');
			}
		}
	}

	firstUpdated() {
		this._getCurrentTheme();
	}

	private _setTheme(theme) {
		this._doc.setAttribute('data-theme', theme);

		localStorage.setItem('theme', theme);
		this.theme = theme;
	}

	private _switchTheme() {
		const currentTheme = this.theme;
		if (currentTheme === 'default') {
			this._setTheme('dark');
		} else if (currentTheme === 'dark') {
			this._setTheme('default');
		} else {
			this._setTheme('default');
		}
	}

	render() {
		this.firstUpdated();
		const themeButtons = html`
				<div class="theme-select__container">
					<button
						@click=${() => this._switchTheme()}
						?active=${this.theme}
						title=${this.theme === 'default' ? `Take me to the dark side!` : `Show me the light!`}
					>
						${themes[this.theme].icon}
					</button>
				</div>
			`;

		return html` <div class="theme-switcher__container">${themeButtons}</div> `;
	}
}
