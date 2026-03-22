export class PageTimer {
	active: boolean;
	time: number;
	timer?: number;

	constructor() {
		this.active = $state(false);
		this.time = $state(0);
		this.timer = undefined;
	}

	start = (): void => {
		if (this.time) return;
		this.active = true;
		this.timer = setInterval(() => {
			this.time++;
		}, 1000);
	};

	stop = (): void => {
		if (!this.timer) return;
		this.active = false;
		clearInterval(this.timer);
	};

	reset = (): void => {
		this.time = 0;
	};

	toggle = (): void => {
		if (this.active) {
			this.stop();
		} else {
			this.start();
		}
	};
}

export class SelectTooltip {
	visible: boolean;
	text: string;
	coords: {
		x: number;
		y: number;
	};

	result: {
		show: boolean;
		text: string;
	};

	constructor() {
		this.visible = $state(false);
		this.text = $state('');
		this.coords = $state({
			x: 0,
			y: 0
		});
		this.result = $state({
			show: false,
			text: ''
		});
	}

	handleSelection = (): void => {
		const selection = window.getSelection();

		if (!selection || selection.isCollapsed) {
			this.visible = false;
			return;
		}

		const text = selection.toString().trim();
		if (!text) {
			this.visible = false;
			return;
		}

		let range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		this.text = text;
		this.coords.x = rect.right - rect.left / 2;
		this.coords.y = rect.bottom;

		this.visible = true;

		this.translate(this.text, 'tr');
		this.result.show = true;
	};

	handleClick = () => {
		//this.translate(this.text, "tr");
		//this.result.show = true;
	};

	translate = async (text: string, target_lang: string) => {
		fetch(
			`https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=${target_lang}&q=${text}`
		)
			.then((response) => response.json())
			.then((response) => {
				if (response) {
					this.result.text = response[0][0][0];
				} else {
					this.result.text = 'Error';
				}
			});
	};
}
