import { LitElement, html, css, unsafeCSS, unsafeHTML } from '../../js/lib/lit-all.min.js';
import { commonStyles, optionStyles } from './shared-styles.js';
import { icons, icon, iconUrl } from '../icons.js'; 

class DragGestureManager extends LitElement {

	static properties = {
		type: { type: String },       
		dragGestures: { type: Array },    
		advancedMode: { type: Boolean }, 
	};

	static styles = [
		commonStyles,
		optionStyles,
		css`
			:host {
				display: block;
			}
			.drag-rows-container {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.drag-row {
				display: flex;
				align-items: stretch;
				gap: 0;
				border-radius: 8px;
				overflow: hidden;
			}
			.drag-row-wrapper {
				display: block;
				flex: 1;
				min-width: 0;
			}
			.drag-row-content {
				display: flex;
				flex-direction: column;
				border-radius: 8px;
				overflow: hidden;
				border: 1px solid var(--border-color);
				background: var(--bg-secondary);
			}
			.drag-row select {
				padding: 5px 8px;
				border-radius: 5px;
				background: var(--card-bg);
				font-size: 13px;
			}
			.direction-btn {
				display: inline-flex;
				align-items: center;
				gap: 2px;
				min-width: 50px;
				padding: 7px 8px;
				border-radius: 6px;
				border: 1px solid var(--border-color);
				background: var(--card-bg);
				color: var(--text-color);
				font-size: 16px;
				cursor: pointer;
				transition: all 0.15s;
				justify-content: center;
				line-height: 1.4;
				flex-wrap: wrap;
			}
			.direction-btn:hover {
				border-color: var(--accent-color);
				background: color-mix(in srgb, var(--accent-color) 8%, var(--card-bg));
			}
			.position-select {
				min-width: 60px;
			}
			.action-select {
				min-width: 100px;
			}
			.engine-select {
				min-width: 80px;
			}
			input[type="text"].url-input {
				padding: 5px 8px;
				border-radius: 5px;
				border: 1px solid var(--border-color);
				background: var(--card-bg);
				color: var(--text-color);
				font-size: 12px;
				flex: 1;
				min-width: 150px;
			}
			input[type="text"].url-input::placeholder {
				color: var(--text-muted);
			}
			.drag-row-primary {
				display: flex;
				align-items: center;
				gap: 0;
				padding: 0;
			}
			.drag-row-primary-content {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 8px;
				padding: 8px 10px;
				flex: 1;
				min-width: 0;
			}
			.drag-row-toggle {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 28px;
				align-self: stretch;
				flex-shrink: 0;
				background: transparent;
				border: none;
				border-left: 1px solid var(--border-color-light, color-mix(in srgb, var(--border-color) 50%, transparent));
				padding: 0;
				cursor: pointer;
				color: var(--text-muted);
				transition: color 0.15s;
			}
			.drag-row-toggle:hover {
				color: var(--accent-color);
				background: color-mix(in srgb, var(--accent-color) 6%, transparent);
			}
			.drag-row-toggle svg {
				width: 18px;
				height: 18px;
				transition: transform 0.2s;
			}
			.drag-row-toggle.expanded svg {
				transform: rotate(180deg);
			}
			.drag-row-secondary {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 8px;
				padding: 8px 10px;
				background: color-mix(in srgb, var(--bg-tertiary) 50%, var(--bg-secondary) 50%);
				border-top: 1px solid var(--border-color-light, color-mix(in srgb, var(--border-color) 50%, transparent));
			}
			.drag-delete-btn,
			.drag-copy-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				align-self: center;
				width: 20px;
				height: 20px;
				flex-shrink: 0;
				background: transparent;
				border: none;
				padding: 0;
				cursor: pointer;
				color: var(--text-muted);
				transition: color 0.15s;
			}
			.drag-delete-btn {
				margin-inline-start: 4px;
			}
			.drag-copy-btn {
				margin-inline-start: 10px;
			}
			.drag-delete-btn:hover {
				color: var(--danger-color);
			}
			.drag-copy-btn:hover {
				color: var(--accent-color);
			}
			.drag-delete-btn::before,
			.drag-copy-btn::before {
				content: '';
				width: 14px;
				height: 14px;
				background-color: currentColor;
				mask-size: contain;
				mask-repeat: no-repeat;
				mask-position: center;
				-webkit-mask-size: contain;
				-webkit-mask-repeat: no-repeat;
				-webkit-mask-position: center;
			}
			.drag-delete-btn::before {
				mask-image: ${unsafeCSS(iconUrl('trash2'))};
				-webkit-mask-image: ${unsafeCSS(iconUrl('trash2'))};
			}
			.drag-copy-btn::before {
				mask-image: ${unsafeCSS(iconUrl('copy'))};
				-webkit-mask-image: ${unsafeCSS(iconUrl('copy'))};
			}
			.drag-add-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-inline: auto;
				padding: 8px 20px;
				margin-top: 8px;
				background: transparent;
				border: 1.5px dashed var(--border-color);
				border-radius: 8px;
				color: var(--text-muted);
				cursor: pointer;
				transition: all 0.2s ease;
			}
			.drag-add-btn:hover {
				border-color: var(--accent-color);
				background: rgba(66, 133, 244, 0.06);
				color: var(--accent-color);
			}
			.drag-add-btn svg {
				width: 18px;
				height: 18px;
				stroke-width: 1.5;
			}
			:host(:not([advanced-mode])) .drag-add-btn {
				display: none;
			}
			:host(:not([advanced-mode])) .drag-row-toggle,
			:host(:not([advanced-mode])) .drag-row-secondary {
				display: none !important;
			}
			:host(:not([advanced-mode])) .direction-btn {
				border-color: transparent;
				background: transparent;
				cursor: default;
				pointer-events: none;
			}
			:host(:not([advanced-mode])) .drag-delete-btn,
			:host(:not([advanced-mode])) .drag-copy-btn {
				display: none;
			}
		`,
	];

	constructor() {
		super();
		this.type = 'text';
		this.dragGestures = [];
		this.advancedMode = false;
	}

	get _actions() {
		const { TEXT_DRAG_ACTIONS, LINK_DRAG_ACTIONS, IMAGE_DRAG_ACTIONS } = window.GestureConstants;
		switch (this.type) {
			case 'text': return TEXT_DRAG_ACTIONS;
			case 'link': return LINK_DRAG_ACTIONS;
			case 'image': return IMAGE_DRAG_ACTIONS;
			default: return {};
		}
	}

	render() {
		const dragGestures = structuredClone(this.dragGestures);

		return html`
			<div class="drag-rows-container">
				${dragGestures.map((cfg, index) => this.#renderRow(cfg, index, dragGestures.length))}
			</div>
			<button type="button" class="drag-add-btn" @click=${this.#addRow}>${unsafeHTML(icon('plus', { strokeWidth: 2.5 }))}</button>
			<gesture-recorder id="dragRecorder" data-gesture-ignore></gesture-recorder>
		`;
	}

	#renderRow(cfg, index, totalRows) {
		const { TAB_POSITIONS } = window.GestureConstants;

		const action = cfg.action || 'none';
		const position = cfg.position || 'right';
		const active = cfg.active !== false;
		const engine = cfg.engine || (this.type === 'text' ? 'system' : 'google');
		const url = cfg.url || '';
		const direction = cfg.direction || '→';
		const autoDetectUrl = cfg.autoDetectUrl === true;
		const preferLink = cfg.preferLink === true;
		const incognito = cfg.incognito === true;

		const showPos = ['openTab', 'search', 'imageSearch'].includes(action);
		const showActive = showPos && position !== 'current';
		const showIncognito = ['openTab', 'search', 'imageSearch'].includes(action);
		const showEngine = (this.type === 'text' && action === 'search') || (this.type === 'image' && action === 'imageSearch');
		const showUrl = (this.type === 'text' && action === 'search' && engine === 'custom') ||
			(this.type === 'image' && action === 'imageSearch' && engine === 'custom');
		const showPreferLink = this.type === 'image' && action === 'openTab';

		const showSecondary = showPos || showIncognito;

		const isExpanded = cfg.simple !== true;

		return html`
			<div class="drag-row">
				<div class="drag-row-wrapper">
					<div class="drag-row-content">
						<div class="drag-row-primary">
							<div class="drag-row-primary-content">
								<button type="button" class="direction-btn"
									@click=${() => this.#changeDirection(index)}>
									${unsafeHTML(window.GestureConstants.arrowsToSvg(direction))}
								</button>

								<select class="action-select" .value=${action}
									@change=${(e) => this.#handleActionChange(index, e.target.value)}>
									${Object.entries(this._actions).map(([v, k]) => html`
										<option value=${v} ?selected=${action === v}>${window.i18n.getMessage(k)}</option>
									`)}
								</select>

								${(this.type === 'text' || this.type === 'image') ? html`
									<select class="engine-select" style=${showEngine ? '' : 'display:none'}
										.value=${engine}
										@change=${(e) => this.#handleEngineChange(index, e.target.value)}>
										${this.#renderEngineOptions(engine)}
									</select>
								` : ''}

								<input type="text" class="url-input"
									placeholder=${this.type === 'text' ? window.i18n.getMessage('urlPlaceholderText') : window.i18n.getMessage('urlPlaceholderImage')}
									.value=${url}
									style=${showUrl ? '' : 'display:none'}
									@input=${(e) => this.#updateRow(index, 'url', e.target.value)}>

								${this.type === 'text' ? html`
									<label class="inline-checkbox auto-detect-label" style=${showEngine ? '' : 'display:none'}>
										<input type="checkbox" .checked=${autoDetectUrl}
											@change=${(e) => this.#updateRow(index, 'autoDetectUrl', e.target.checked)}>
										<span>${window.i18n.getMessage('autoDetectUrl')}</span>
									</label>
								` : ''}

								${this.type === 'image' ? html`
									<label class="inline-checkbox prefer-link-label" style=${showPreferLink ? '' : 'display:none'}>
										<input type="checkbox" .checked=${preferLink}
											@change=${(e) => this.#updateRow(index, 'preferLink', e.target.checked)}>
										<span>${window.i18n.getMessage('preferLink')}</span>
									</label>
								` : ''}
							</div>

							${showSecondary ? html`
								<button type="button" class="drag-row-toggle ${isExpanded ? 'expanded' : ''}"
									@click=${() => this.#toggleSecondary(index)}>
									${unsafeHTML(icons.chevronDown)}
								</button>
							` : ''}
						</div>

						<div class="drag-row-secondary" style=${showSecondary && isExpanded ? '' : 'display:none'}>
							<select class="position-select" style=${showPos ? (incognito ? 'opacity: 0.5' : '') : 'display:none'}
								.value=${position}
								@change=${(e) => this.#updateRow(index, 'position', e.target.value)}>
								${Object.entries(TAB_POSITIONS).map(([value, key]) => html`
									<option value=${value} ?selected=${position === value}>${window.i18n.getMessage(key)}</option>
								`)}
							</select>

							<label class="inline-checkbox active-label" style=${showActive ? (incognito ? 'opacity: 0.5' : '') : 'display:none'}>
								<input type="checkbox" .checked=${active}
									@change=${(e) => this.#updateRow(index, 'active', e.target.checked)}>
								${window.i18n.getMessage('newTabActive')}
							</label>

							<label class="inline-checkbox incognito-label" style=${showIncognito ? '' : 'display:none'}>
								<input type="checkbox" .checked=${incognito}
									@change=${(e) => this.#handleIncognitoChange(index, e.target.checked)}>
								${window.i18n.getMessage('openInIncognito', 'Open in Incognito')}
							</label>
						</div>
					</div>
				</div>

				<button type="button" class="drag-copy-btn"
					@click=${() => this.#copyRow(index)}></button>
				<button type="button" class="drag-delete-btn"
					@click=${() => this.#deleteRow(index)}></button>
			</div>
		`;
	}

	#renderEngineOptions(current) {
		if (this.type === 'text') {
			return this.#renderSearchEngineOptions(current);
		} else if (this.type === 'image') {
			return this.#renderImageSearchEngineOptions(current);
		}
		return '';
	}

	#renderSearchEngineOptions(current) {
		const { SEARCH_ENGINES, SEARCH_ENGINE_ORDER } = window.GestureConstants;
		const lang = window.i18n.getCurrentLanguage();
		const order = SEARCH_ENGINE_ORDER[lang] || SEARCH_ENGINE_ORDER['default'];
		const displayKeys = [...order];

		if (current && current !== 'custom' && !displayKeys.includes(current) && SEARCH_ENGINES[current]) {
			displayKeys.push(current);
		}

		return html`
			${displayKeys.map(key => {
			const engine = SEARCH_ENGINES[key];
			if (!engine) return '';
			const label = engine.i18nKey ? window.i18n.getMessage(engine.i18nKey) : engine.name;
			return html`<option value=${key} ?selected=${current === key}>${label}</option>`;
		})}
			<option value="custom" ?selected=${current === 'custom'}>${window.i18n.getMessage('custom')}</option>
		`;
	}

	#renderImageSearchEngineOptions(current) {
		const { IMAGE_SEARCH_ENGINES, IMAGE_SEARCH_ENGINE_ORDER } = window.GestureConstants;
		const lang = window.i18n.getCurrentLanguage();
		const order = IMAGE_SEARCH_ENGINE_ORDER[lang] || IMAGE_SEARCH_ENGINE_ORDER['default'];
		const displayKeys = [...order];

		if (current && current !== 'custom' && !displayKeys.includes(current) && IMAGE_SEARCH_ENGINES[current]) {
			displayKeys.push(current);
		}

		return html`
			${displayKeys.map(key => {
			const engine = IMAGE_SEARCH_ENGINES[key];
			if (!engine) return '';
			const label = engine.i18nKey ? window.i18n.getMessage(engine.i18nKey) : engine.name;
			return html`<option value=${key} ?selected=${current === key}>${label}</option>`;
		})}
			<option value="custom" ?selected=${current === 'custom'}>${window.i18n.getMessage('custom')}</option>
		`;
	}

	#updateRow(index, field, value) {
		const dragGestures = structuredClone(this.dragGestures);
		dragGestures[index][field] = value;
		this.#dispatchChange(dragGestures);
	}

	#handleActionChange(index, value) {
		this.dispatchEvent(new CustomEvent('permission-check', {
			detail: { action: value },
			bubbles: true,
			composed: true,
		}));
		this.#updateRow(index, 'action', value);
	}

	#handleIncognitoChange(index, value) {
		if (value) {
			this.dispatchEvent(new CustomEvent('permission-check', {
				detail: { action: 'openInIncognito' },
				bubbles: true,
				composed: true,
			}));
		}
		this.#updateRow(index, 'incognito', value);
	}

	#handleEngineChange(index, value) {
		this.#updateRow(index, 'engine', value);
	}

	async #changeDirection(index) {
		const recorder = this.shadowRoot.getElementById('dragRecorder');
		if (!recorder) return;
		const result = await recorder.open({ button: 'left' });
		if (result.cancelled || !result.pattern) return;
		this.#updateRow(index, 'direction', result.pattern);
	}

	async #addRow() {
		const usedDirs = this.dragGestures.map(g => g.direction);
		const basicDirs = ['→', '↓', '←', '↑'];
		const freeBasic = basicDirs.find(d => !usedDirs.includes(d));

		let direction;
		if (freeBasic) {
			direction = freeBasic;
		} else {
			const recorder = this.shadowRoot.getElementById('dragRecorder');
			if (!recorder) return;
			const result = await recorder.open({ button: 'left' });
			if (result.cancelled || !result.pattern) return;
			direction = result.pattern;
		}

		const dragGestures = structuredClone(this.dragGestures);
		dragGestures.push({
			direction,
			action: this.type === 'text' ? 'search' : 'openTab',
			position: 'right',
			active: true,
			engine: this.type === 'text' ? 'system' : 'google',
			url: '',
			autoDetectUrl: true,
			incognito: false,
			simple: true,
		});
		this.#dispatchChange(dragGestures);
	}

	#toggleSecondary(index) {
		const dragGestures = structuredClone(this.dragGestures);
		dragGestures[index].simple = !dragGestures[index].simple;
		this.#dispatchChange(dragGestures);
	}

	#copyRow(index) {
		const dragGestures = structuredClone(this.dragGestures);
		const copy = structuredClone(dragGestures[index]);
		dragGestures.splice(index + 1, 0, copy);
		this.#dispatchChange(dragGestures);
	}

	#deleteRow(index) {
		const dragGestures = structuredClone(this.dragGestures);
		if (dragGestures.length <= 1) {
			dragGestures[index].direction = '→';
			dragGestures[index].action = 'none';
		} else {
			dragGestures.splice(index, 1);
		}
		this.#dispatchChange(dragGestures);
	}

	#dispatchChange(dragGestures) {
		this.dragGestures = dragGestures;
		this.dispatchEvent(new CustomEvent('drag-gestures-change', {
			detail: { dragGestures: dragGestures },
			bubbles: true,
			composed: true,
		}));
	}
}

window.i18n.waitForInit().then(() => {
	customElements.define('drag-gesture-manager', DragGestureManager);
});