import { describe, expect, it } from 'vitest';
import { mapOpenWeatherCondition, mapWeatherCode, parseCoordinate } from '$lib/weather';

describe('weather domain', () => {
	it('validates coordinates and bounds', () => {
		expect(parseCoordinate('41.08', -90, 90)).toBeCloseTo(41.08);
		expect(parseCoordinate('91', -90, 90)).toBeNull();
		expect(parseCoordinate('nope', -90, 90)).toBeNull();
		expect(parseCoordinate(null, -90, 90)).toBeNull();
	});

	it('maps provider conditions without collapsing snow and storms into rain', () => {
		expect(mapOpenWeatherCondition('Clear')).toBe('sunny');
		expect(mapOpenWeatherCondition('Snow')).toBe('snow');
		expect(mapOpenWeatherCondition('Thunderstorm')).toBe('thunderstorm');
		expect(mapOpenWeatherCondition('Unknown')).toBe('partly-cloudy');
	});

	it('maps Open-Meteo codes', () => {
		expect(mapWeatherCode(0)).toBe('sunny');
		expect(mapWeatherCode(2)).toBe('partly-cloudy');
		expect(mapWeatherCode(55)).toBe('drizzle');
		expect(mapWeatherCode(65)).toBe('rainy');
		expect(mapWeatherCode(75)).toBe('snow');
		expect(mapWeatherCode(99)).toBe('thunderstorm');
		expect(mapWeatherCode(1000)).toBe('partly-cloudy');
	});
});
