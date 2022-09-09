export interface Badge {
	readonly text: string
	readonly type: BadgeColor
}

export enum BadgeColor {
	BLUE = 'default',
	GREEN = 'success',
	GREY = 'info',
	YELLOW = 'warning',
	RED = 'danger'
}