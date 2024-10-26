import { defineExtensionMessaging } from "@webext-core/messaging";

export type ProtocolMap = {
	closeTweetTab(): void;
	isMac(): Promise<boolean>;
};

export const { sendMessage, onMessage } =
	defineExtensionMessaging<ProtocolMap>();
