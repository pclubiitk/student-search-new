/**
 * Debounce utility function
 * Delays the execution of a function until after a specified wait time has elapsed
 * since the last time it was invoked.
 * 
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A debounced version of the function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce(handleSearch, 300);
 * debouncedSearch(query);
 * ```
 */
function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout | null = null;

	return function (this: any, ...args: Parameters<T>): void {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

export default debounce;