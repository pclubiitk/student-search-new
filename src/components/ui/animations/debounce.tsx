function basic_debounce(func: Function, time: number) : Function {
	let timer: any;
	return (function (this:any, ...args: any[]) {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), time);
	});
}

export default basic_debounce;