const understandUrlVideo = (valueInput) => {

		let idContentVideo = "";
		let typeVideo = "";
		
	  // https://regexr.com/3akf5
	  const isYoutube = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/;
	  
	  const isTwitchClip1 = /[\W\w]*www.twitch.tv\/[\W\w]*\/clip\//; // https://www.twitch.tv/akr114/clip/SassyEagerHamBibleThump?filter=clips&range=30d&sort=time
	  const isTwitchClip2 = /[\W\w]*clips.twitch.tv\//; // https://clips.twitch.tv/RudeCrispyPheasantAllenHuhu
	  
	  
	  if (isYoutube.test(valueInput)){
	    typeVideo = "Youtube";
	    
	  	// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
	    const matchIdContent = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	    const match = (valueInput).match(matchIdContent);
	    if (match&&match[7].length==11) {
	      idContentVideo = match[7];
	    }
	  }
	  
	  else if (isTwitchClip1.test(valueInput)){
	    typeVideo = "Twitch Clip";
	    // https://stackoverflow.com/questions/31262539/how-can-i-extract-text-from-the-middle-of-a-string-with-javascript
	    const regexFront = /[\W\w]*www.twitch.tv\/[\W\w]*\/clip\//;
	    const regexBack = /(\?[^\?]*)$/
	    
	    idContentVideo = valueInput.replace(regexFront, "");
	    idContentVideo = idContentVideo.replace(regexBack, "");
	  }
	  
	  else if (isTwitchClip2.test(valueInput)){
	    typeVideo = "Twitch Clip";
	    // https://stackoverflow.com/questions/31262539/how-can-i-extract-text-from-the-middle-of-a-string-with-javascript
	    const regexFront = /[\W\w]*clips.twitch.tv\//;
	    const regexBack = /(\?[^\?]*)$/
	    
	    idContentVideo = valueInput.replace(regexFront, "");
	    idContentVideo = idContentVideo.replace(regexBack, "");
	  }
	  
	  else {
	    typeVideo = "Others";
	  }
	  
	  
	  return [typeVideo, idContentVideo];
	  
	}
	
	export default understandUrlVideo;