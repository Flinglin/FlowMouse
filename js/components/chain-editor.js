import { LitElement, html, css, unsafeCSS, unsafeHTML } from '../lib/lit-all.min.js';
import { commonStyles, optionStyles } from './shared-styles.js';
import { icons, icon, iconUrl } from '../icons.js'; 

class ChainEditor extends LitElement {

	static properties = {
		actionChains: { type: Object },
		_expandedChain: { state: true },
	};

	static styles = [
		commonStyles,
		optionStyles,
		css`
			:host {
				display: block;
			}

			.chains-container {
				display: flex;
				flex-direction: column;
				gap: 10px;
			}

			.empty-state {
				height: 57px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--text-muted);
				font-size: 13px;
				border: 1px dashed var(--border-color);
				border-radius: 10px;
			}

			.chain-row {
				display: flex;
				align-items: stretch;
				gap: 0;
			}
			.chain-card {
				flex: 1;
				min-width: 0;
				border: 1px solid var(--border-color);
				border-radius: 10px;
				background: var(--bg-secondary);
				overflow: hidden;
				transition: box-shadow 0.15s ease;
			}
			.chain-card.expanded {
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			}
			
			.chain-delete-btn,
			.chain-copy-btn {
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
			.chain-delete-btn {
				margin-inline-start: 4px;
			}
			.chain-copy-btn {
				margin-inline-start: 10px;
			}
			.chain-delete-btn:hover {
				color: var(--danger-color);
			}
			.chain-copy-btn:hover {
				color: var(--accent-color);
			}
			.chain-delete-btn::before,
			.chain-copy-btn::before {
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
			.chain-delete-btn::before {
				mask-image: ${unsafeCSS(iconUrl('trash2'))};
				-webkit-mask-image: ${unsafeCSS(iconUrl('trash2'))};
			}
			.chain-copy-btn::before {
				mask-image: ${unsafeCSS(iconUrl('copy'))};
				-webkit-mask-image: ${unsafeCSS(iconUrl('copy'))};
			}

			.chain-header {
				display: flex;
				align-items: center;
				gap: 10px;
				padding: 10px 12px;
				cursor: pointer;
				user-select: none;
				transition: background 0.15s ease;
			}
			.chain-header:hover {
				background: var(--hover-bg);
			}

			.chain-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 34px;
				height: 34px;
				border-radius: 8px;
				border: 1px solid var(--border-color);
				background: var(--card-bg);
				color: var(--accent-color);
				flex-shrink: 0;
			}
			.chain-icon svg {
				width: 18px;
				height: 18px;
			}

			.chain-info {
				flex: 1;
				min-width: 0;
			}
			.chain-name {
				font-size: 13px;
				line-height: 19px;
				font-weight: 600;
				color: var(--text-primary);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.chain-summary {
				font-size: 11px;
				color: var(--text-muted);
				margin-top: 2px;
				display: flex;
				align-items: center;
				gap: 2px;
				flex-wrap: wrap;
			}
			.chain-summary .step-sep {
				display: flex;
				align-items: center;
				flex-shrink: 0;
			}
			.chain-summary .step-sep svg {
				transform: translateY(1px);
			}
			:host-context([dir="rtl"]) .chain-summary .step-sep svg {
				transform: translateY(1px) scaleX(-1);
			}

			.chain-expand-icon {
				display: flex;
				align-items: center;
				color: var(--text-muted);
				transition: transform 0.2s ease;
				flex-shrink: 0;
			}
			.chain-expand-icon.expanded {
				transform: rotate(180deg);
			}
			.chain-expand-icon svg {
				width: 16px;
				height: 16px;
			}

			.chain-body {
				border-top: 1px solid var(--border-color);
				padding: 14px;
				display: flex;
				flex-direction: column;
				gap: 12px;
				background: color-mix(in srgb, var(--bg-tertiary) 50%, var(--bg-secondary) 50%);
			}

			.chain-settings-row {
				display: flex;
				align-items: center;
				gap: 10px;
				flex-wrap: wrap;
			}

			input.chain-name-input {
				flex: 1;
				min-width: 140px;
				padding: 8px 10px;
				font-size: 14px;
				border-radius: 6px;
				border: 0;
				box-shadow: 0 0 0 0.75px var(--border-color);
				background: var(--input-bg);
				color: var(--text-primary);
				font-family: inherit;
				transition: box-shadow 0.15s ease;
			}
			.chain-name-input:focus {
				outline: none;
				box-shadow: 0 0 0 2px var(--input-focus-border-color);
			}


			.steps-container {
				display: flex;
				flex-direction: column;
				gap: 6px;
			}

			.step-row {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 6px 8px;
				border-radius: 8px;
				border: 1px solid var(--border-color);
				background: var(--card-bg);
			}

			.step-grip {
				display: flex;
				align-items: center;
				color: var(--text-muted);
				cursor: grab;
				flex-shrink: 0;
				opacity: 0.5;
				transition: opacity 0.15s;
			}
			.step-grip:hover {
				opacity: 1;
			}
			.step-grip svg {
				width: 14px;
				height: 14px;
			}

			.step-number {
				font-size: 11px;
				font-weight: 700;
				color: var(--text-muted);
				min-width: 18px;
				text-align: center;
				flex-shrink: 0;
			}

			.step-action {
				flex: 1;
				min-width: 120px;
			}

			.step-buttons {
				display: flex;
				align-items: center;
				gap: 2px;
				flex-shrink: 0;
				margin-inline-start: auto;
			}

			.step-delete,
			.step-copy {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border: none;
				background: transparent;
				color: var(--text-muted);
				cursor: pointer;
				padding: 4px;
				border-radius: 4px;
				transition: background 0.15s ease, color 0.15s ease;
				flex-shrink: 0;
			}
			.step-delete:hover {
				background: var(--hover-bg);
				color: var(--danger-color, #ea4335);
			}
			.step-copy:hover {
				background: var(--hover-bg);
				color: var(--accent-color);
			}
			.step-delete svg,
			.step-copy svg {
				width: 14px;
				height: 14px;
			}

			.empty-steps {
				height: 45px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--text-muted);
				font-size: 12px;
				border: 1px dashed var(--border-color);
				border-radius: 8px;
			}

			.chain-footer {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.add-step-btn {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				padding: 5px 12px;
				font-size: 12px;
				border-radius: 6px;
				border: 1px solid var(--border-color);
				background: var(--card-bg);
				color: var(--text-secondary);
				cursor: pointer;
				transition: all 0.15s ease;
				font-family: inherit;
			}
			.add-step-btn:hover {
				background: var(--hover-bg);
				color: var(--accent-color);
				border-color: var(--accent-color);
			}
			.add-step-btn svg {
				width: 13px;
				height: 13px;
			}

			.add-chain-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-inline: auto;
				gap: 6px;
				padding: 8px 15px;
				background: transparent;
				border: 1.5px dashed var(--border-color);
				border-radius: 8px;
				color: var(--text-muted);
				font-size: 13px;
				font-family: inherit;
				cursor: pointer;
				transition: all 0.2s ease;
			}
			.add-chain-btn:hover {
				border-color: var(--accent-color);
				background: rgba(66, 133, 244, 0.06);
				color: var(--accent-color);
			}
			.add-chain-btn svg {
				width: 18px;
				height: 18px;
				stroke-width: 1.5;
			}
		`,
	];

	constructor() {
		super();
		this.actionChains = {};
		this._expandedChain = null;
		this._dragState = null;
	}

	render() {
		const i18n = window.i18n;
		const entries = Object.entries(this.actionChains || {});

		return html`
			<div class="chains-container">
				${entries.length === 0 ? html`
					<div class="empty-state">${i18n.getMessage('noChains')}</div>
				` : entries.map(([id, chain]) => this.#renderChainCard(id, chain))}

				<button class="add-chain-btn" @click=${this.#addChain}>
					${unsafeHTML(icon('plus', { size: 15, strokeWidth: 2 }))}
					<span>${i18n.getMessage('addChain')}</span>
				</button>
			</div>
		`;
	}

	#renderChainCard(id, chain) {
		const i18n = window.i18n;
		const expanded = this._expandedChain === id;
		const stepCount = chain.steps?.length || 0;
		const { ACTION_KEYS } = window.GestureConstants;

		const summaryParts = stepCount === 0
			? null
			: chain.steps.map((s, i) => {
				const label = i18n.getMessage(ACTION_KEYS[s.action] || 'actionNone');
				return i === 0
					? html`<span>${label}</span>`
					: html`<span class="step-sep">${unsafeHTML(icon('chevronRight', { size: 11, strokeWidth: 2.5 }))}</span><span>${label}</span>`;
			});

		return html`
			<div class="chain-row">
				<div class="chain-card ${expanded ? 'expanded' : ''}">
					<div class="chain-header" @click=${() => this.#toggleExpand(id)}>
						<span class="chain-icon">${unsafeHTML(icons.workflow)}</span>
						<div class="chain-info">
							<div class="chain-name">${chain.name || i18n.getMessage('chainNamePlaceholder')}</div>
							<div class="chain-summary">${summaryParts || i18n.getMessage('emptyChainStepsShort')}</div>
						</div>
						<span class="chain-expand-icon ${expanded ? 'expanded' : ''}">
							${unsafeHTML(icon('chevronDown', { size: 16, strokeWidth: 2 }))}
						</span>
					</div>
					${expanded ? this.#renderChainBody(id, chain) : ''}
				</div>
				<button class="chain-copy-btn"
					@click=${() => this.#copyChain(id)}></button>
				<button class="chain-delete-btn"
					@click=${() => this.#deleteChain(id)}></button>
			</div>
		`;
	}

	#renderChainBody(id, chain) {
		const i18n = window.i18n;
		const steps = chain.steps || [];

		return html`
			<div class="chain-body">
				<div class="chain-settings-row">
					<input class="chain-name-input" type="text"
						.value=${chain.name || ''}
						placeholder=${i18n.getMessage('chainNamePlaceholder')}
						maxlength="200"
						@change=${e => this.#updateChain(id, { name: e.target.value })}
					>
				</div>

				<div class="steps-container">
					${steps.length === 0 ? html`
						<div class="empty-steps">${i18n.getMessage('emptyChainSteps')}</div>
					` : steps.map((step, idx) => this.#renderStep(id, chain, step, idx))}
				</div>

				<div class="chain-footer">
					<button class="add-step-btn" @click=${() => this.#addStep(id)}>
						${unsafeHTML(icon('plus', { size: 13, strokeWidth: 2.5 }))}
						<span>${i18n.getMessage('addStep')}</span>
					</button>
				</div>
			</div>
		`;
	}

	#renderStep(chainId, chain, step, idx) {
		const i18n = window.i18n;
		const label = i18n.getMessage('stepNumber').replace('%n%', String(idx + 1));

		return html`
			<div class="step-row"
				@dragover=${e => this.#onStepDragOver(e, chainId, idx)}
				@dragend=${() => this.#onStepDragEnd()}
				@drop=${e => this.#onStepDrop(e, chainId, idx)}
			>
				<span class="step-grip" draggable="true"
					@dragstart=${e => this.#onStepDragStart(e, chainId, idx)}
				>${unsafeHTML(icon('gripVertical', { size: 14, strokeWidth: 2 }))}</span>
				<span class="step-number">${idx + 1}</span>
				<div class="step-action">
					<action-select
						.value=${step.action || 'none'}
						.config=${step}
						.gestureLabel=${label}
						exclude-chain
						@action-change=${e => this.#onStepActionChange(chainId, idx, e.detail)}
						@permission-check=${this.#onPermissionCheck}
					></action-select>
				</div>
				<div class="step-buttons">
					<button class="step-copy" @click=${() => this.#copyStep(chainId, idx)}>
						${unsafeHTML(icon('copy', { size: 14, strokeWidth: 2 }))}
					</button>
					<button class="step-delete" @click=${() => this.#deleteStep(chainId, idx)}>
						${unsafeHTML(icon('x', { size: 14, strokeWidth: 2.5 }))}
					</button>
				</div>
			</div>
		`;
	}


	#generateId() {
		const existing = new Set(Object.keys(this.actionChains || {}));
		let id;
		do {
			const uuid = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
			id = `chain_${uuid}`;
		} while (existing.has(id));
		return id;
	}

	#addChain() {
		const id = this.#generateId();
		const chains = { ...(this.actionChains || {}) };
		const existingCount = Object.keys(chains).length;
		const defaultName = `${window.i18n.getMessage('chainNamePlaceholder')} ${existingCount + 1}`;
		chains[id] = { name: defaultName, steps: [] };
		this._expandedChain = id;
		this.#emitChange(chains);
	}

	#deleteChain(id) {
		const i18n = window.i18n;
		const chain = this.actionChains[id];
		const stepCount = chain?.steps?.length || 0;
		if (stepCount > 0) {
			const name = chain?.name || i18n.getMessage('chainNamePlaceholder');
			if (!confirm(i18n.getMessage('deleteChainConfirm').replace('%name%', name))) return;
		}

		const chains = { ...(this.actionChains || {}) };
		delete chains[id];
		if (this._expandedChain === id) this._expandedChain = null;
		this.#emitChange(chains);
	}

	#copyChain(id) {
		const newId = this.#generateId();
		const chains = {};
		for (const [key, val] of Object.entries(this.actionChains || {})) {
			chains[key] = val;
			if (key === id) chains[newId] = structuredClone(val);
		}
		this._expandedChain = newId;
		this.#emitChange(chains);
	}

	#updateChain(id, patch) {
		const chains = { ...(this.actionChains || {}) };
		chains[id] = { ...chains[id], ...patch };
		this.#emitChange(chains);
	}

	#toggleExpand(id) {
		this._expandedChain = this._expandedChain === id ? null : id;
	}


	#addStep(chainId) {
		const chains = { ...(this.actionChains || {}) };
		const chain = { ...chains[chainId] };
		chain.steps = [...(chain.steps || []), { action: 'none' }];
		chains[chainId] = chain;
		this.#emitChange(chains);
	}

	#deleteStep(chainId, idx) {
		const chains = { ...(this.actionChains || {}) };
		const chain = { ...chains[chainId] };
		chain.steps = chain.steps.filter((_, i) => i !== idx);
		chains[chainId] = chain;
		this.#emitChange(chains);
	}

	#copyStep(chainId, idx) {
		const chains = { ...(this.actionChains || {}) };
		const chain = { ...chains[chainId] };
		const steps = [...chain.steps];
		const copiedStep = structuredClone(steps[idx]);
		steps.splice(idx + 1, 0, copiedStep);
		chain.steps = steps;
		chains[chainId] = chain;
		this.#emitChange(chains);
	}

	#onStepActionChange(chainId, idx, detail) {
		const chains = { ...(this.actionChains || {}) };
		const chain = { ...chains[chainId] };
		chain.steps = [...chain.steps];
		chain.steps[idx] = { action: detail.action, ...(detail.config || {}) };
		chains[chainId] = chain;
		this.#emitChange(chains);
	}


	#onStepDragStart(e, chainId, idx) {
		this._dragState = { chainId, fromIdx: idx, active: true };
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', '');
		e.currentTarget.style.opacity = '0.5';
	}

	#onStepDragOver(e, chainId, idx) {
		if (!this._dragState || this._dragState.chainId !== chainId) return;
		if (!this._dragState.active) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}

	#onStepDrop(e, chainId, idx) {
		e.preventDefault();
		if (!this._dragState || this._dragState.chainId !== chainId) return;

		const { fromIdx } = this._dragState;
		if (fromIdx === idx) return;

		const chains = { ...(this.actionChains || {}) };
		const chain = { ...chains[chainId] };
		const steps = [...chain.steps];
		const [moved] = steps.splice(fromIdx, 1);
		steps.splice(idx, 0, moved);
		chain.steps = steps;
		chains[chainId] = chain;
		this.#emitChange(chains);
	}

	#onStepDragEnd() {
		this._dragState = null;
		const rows = this.shadowRoot.querySelectorAll('.step-row');
		rows.forEach(r => r.style.opacity = '');
	}


	#emitChange(chains) {
		this.dispatchEvent(new CustomEvent('chains-change', {
			detail: { actionChains: chains },
			bubbles: true,
			composed: true,
		}));
	}

	#onPermissionCheck(e) {
		this.dispatchEvent(new CustomEvent('permission-check', {
			detail: e.detail,
			bubbles: true,
			composed: true,
		}));
	}
}

window.i18n.waitForInit().then(() => {
	customElements.define('chain-editor', ChainEditor);
});