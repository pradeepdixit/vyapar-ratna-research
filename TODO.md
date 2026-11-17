
## Selected-time calculation and period ranking

- [x] Page पर calculation banner जोड़ा गया: चुना हुआ date/time, “इस समय की गणना पूरी” और LIVE SNAPSHOT status स्पष्ट दिखता है।
- [x] Global “गणना का समय → लागू करें” के बाद AstroSnapshot से NIFTY 200 के computable rules दोबारा calculate होते हैं; पुराने snapshot का भ्रम नहीं रखा गया।
- [x] दैनिक, साप्ताहिक, मासिक, मिनट/क्षणिक, पाक्षिक, वार्षिक और ऋतु-आधारित अवधि चुनने पर उसी अवधि के active rule count से descending ranking होती है।
- [x] केवल active filter भी चुनी हुई अवधि के active rules के अनुसार काम करता है; card में उसी अवधि के लागू rules और उनका timeframe दिखता है।
