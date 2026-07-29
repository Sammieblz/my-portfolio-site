export function parseCoordinate(value, minimum, maximum) {
	if (value === null || value.trim() === '') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum ? parsed : null;
}

export function mapOpenWeatherCondition(condition) {
	const conditionMap = {
		Clear: 'sunny',
		Clouds: 'cloudy',
		Rain: 'rainy',
		Drizzle: 'drizzle',
		Thunderstorm: 'thunderstorm',
		Snow: 'snow',
		Mist: 'mist',
		Fog: 'fog',
		Haze: 'haze',
		Dust: 'haze',
		Sand: 'haze',
		Ash: 'haze',
		Squall: 'windy',
		Tornado: 'storm'
	};
	return conditionMap[condition] ?? 'partly-cloudy';
}

export function mapWeatherCode(code) {
	if (code === 0) return 'sunny';
	if ([1, 2].includes(code)) return 'partly-cloudy';
	if ([3, 45, 48].includes(code)) return 'cloudy';
	if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
	if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy';
	if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
	if ([95, 96, 99].includes(code)) return 'thunderstorm';
	return 'partly-cloudy';
}
