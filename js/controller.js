export default class Controller {

	constructor() {
		this.width = 500;
		this.height = 500;

		this.period = 1.5;
		this.animAmt = 0;
	}

	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * 
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		this.renderBg(context);
		this.renderSquares(context);
	}

	renderSquares(context) {
		const size = 70;
		let startIX = 0;
		let startIY = 0.5;
	
		while (size * startIX > -this.width / 2) {
			startIX --;
		}
		while (0.5 * size * startIY > -this.height / 2) {
			startIY --;
		}
	
		for (let iy = startIY; 0.5 * size * (iy - 1) < this.height / 2; iy ++) {
			let yAmt = 2 * 0.5 * size * iy / this.height;
			const type = posMod(iy, 2) < 1
			const color = type ? 'black' : 'white';
			const rowOffset = type ? 0 : 0.5;
	
			for (let ix = startIX + rowOffset + this.animAmt - 1; size * (ix - 1) < this.width / 2; ix ++) {
				let xAmt = 2 * size * ix / this.width;
				if (xAmt > 0.15 && color == 'black') {
					continue;
				}
				if (xAmt < -0.15 && color == 'white') {
					continue;
				}
	
				let splitAmt = (xAmt > 0) ? xAmt : -xAmt;
				splitAmt -= 0.3;
				if (splitAmt < 0) splitAmt = 0;
				splitAmt *= splitAmt;

				let rotAmt = splitAmt * yAmt;
				if (xAmt < 0) {
					rotAmt = -rotAmt;
				}

				let xPos = size * ix;
				let yPos = 0.5 * size * iy * (2 * splitAmt + 1);
				drawSquare(context, xPos, yPos, 4 * Math.PI * rotAmt, color, size / 2);
			}
		}
	}
	
	renderBg(context) {
		context.fillStyle = 'black';
		context.beginPath();
		context.moveTo(0, -this.height);
		context.lineTo(this.width, -this.height);
		context.lineTo(this.width, this.height);
		context.lineTo(0,  this.height);
		context.closePath();
		context.fill();
	}
}

function posMod(a, b) {
	let out = a % b;
	if (out < 0) {
		out += b;
	}
	return out;
}

/**
 * @param {CanvasRenderingContext2D} context 
 */
function drawSquare(context, x, y, angle, color, size) {
	let radius = size;
	context.fillStyle = color;
	context.beginPath();
	for (let i = 0; i < 4; i ++) {
		let amt = (i / 4);
		let localAngle = 2 * Math.PI * amt;
		let localX = radius * Math.cos(angle + localAngle);
		let localY = radius * Math.sin(angle + localAngle);
		if (i == 0) {
			context.moveTo(x + localX, y + localY);
		}
		else {
			context.lineTo(x + localX, y + localY);
		}
	}
	context.closePath();
	context.fill();
}