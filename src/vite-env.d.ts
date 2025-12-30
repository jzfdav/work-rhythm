/// <reference types="vite/client" />

declare const __BUILD_TIME__: string;

declare module "virtual:pwa-register" {
	export function registerSW(options?: {
		immediate?: boolean;
		onNeedRefresh?: () => void;
		onOfflineReady?: () => void;
	}): (reloadPage?: boolean) => Promise<void>;
}
