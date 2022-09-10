import { DUIButton, DUIHeader, DUIInputField, DUILabel, DUILink, DUIMultilineLabel, DUINavigationButton, DUIOAuthButton, DUISection, DUISecureInputField, DUISelect, DUIStepper, DUISwitch } from "..";

declare global {
	namespace App {
		function createSection(info: DUISection): DUISection
		function createButton(info: DUIButton): DUIButton
		function createHeader(info: DUIHeader): DUIHeader
		function createInputField(info: DUIInputField): DUIInputField
		function createLabel(info: DUILabel): DUILabel
		function createLink(info: DUILink): DUILink
		function createMultilineLabel(info: DUIMultilineLabel): DUIMultilineLabel
		function createNavigationButton(info: DUINavigationButton): DUINavigationButton
		function createOAuthButton(info: DUIOAuthButton): DUIOAuthButton
		function createSecureInputField(info: DUISecureInputField): DUISecureInputField
		function createSelect(info: DUISelect): DUISelect
		function createStepper(info: DUIStepper): DUIStepper
		function createSwitch(info: DUISwitch): DUISwitch
	}
}