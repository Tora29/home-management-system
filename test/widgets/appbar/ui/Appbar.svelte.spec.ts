import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import Appbar from '$widgets/appbar/ui/Appbar.svelte';

describe('widgets/appbar/ui/Appbar.svelte', () => {
	test('should render the HMS title', () => {
		render(Appbar);

		const title = screen.getByRole('heading', { name: 'HMS' });
		expect(title.textContent).toBe('HMS');
	});

	test('should render the component without errors', () => {
		const { container } = render(Appbar);
		expect(container.firstChild).toBeTruthy();
	});

	test('should have the correct heading level', () => {
		render(Appbar);

		const title = screen.getByRole('heading', { name: 'HMS' });
		expect(title.tagName).toBe('H1');
	});
});
