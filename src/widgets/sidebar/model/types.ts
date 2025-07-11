import type { Component } from 'svelte';

/**
 * メニューアイテムの型定義
 */
export interface MenuItem {
	id: string;
	title: string;
	href: string;
	icon: Component<{ class?: string }>;
	badge?: string | number;
	isActive?: boolean;
	isDisabled?: boolean;
	children?: MenuItem[];
}

/**
 * サイドバーのプロパティ
 */
export interface SidebarProps {
	isCollapsed?: boolean;
	menuItems?: MenuItem[];
	showToggle?: boolean;
	className?: string;
}

/**
 * サイドバーの状態
 */
export interface SidebarState {
	isCollapsed: boolean;
	activeItemId: string | null;
	expandedItems: string[];
}

/**
 * サイドバーのイベント
 */
export interface SidebarEvents {
	'menu-item-click': {
		item: MenuItem;
		event: MouseEvent;
	};
	'toggle-sidebar': {
		isCollapsed: boolean;
	};
	'toggle-submenu': {
		itemId: string;
		isExpanded: boolean;
	};
}
