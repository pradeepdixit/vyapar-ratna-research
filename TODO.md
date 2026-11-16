
## Selected-time SBC calculation

- [x] SBC current geometry, planet positions, padas, active encoded book rules, market/share filters और 2/24-hour forward samples selected `snapshot.iso` से calculate होते हैं।
- [x] User द्वारा date-time बदलकर `लागू करें` दबाने पर नया AstroSnapshot बनता है; SBC stale previous result हटाकर उसी selected time पर research recompute करता है।
- [x] SBC result panel में स्पष्ट dark-blue `गणना का समय` badge जोड़ा गया है, जिसमें local time, location और selected snapshot basis लिखा है।
