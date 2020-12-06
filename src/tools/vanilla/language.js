
export const language_browser_to_ISO_639_1 = (language_browser) => {
	
	if ( ["ko", "ko-kr", "ko-KR"].includes(language_browser) ) {
		return "ko";
	}
	
	else if ( ["ja"].includes(language_browser) ) {
		return "ja";
	}
	
	else {
		return "en";
	}
	
}
