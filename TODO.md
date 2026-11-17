
## Analysis ↔ My Stock Selection linking

- [x] Analysis page heading से My Stock Selection का direct link और My Stock page heading से समय-सीमा Analysis का direct link जोड़ा गया।
- [x] Analysis range पूरी होने के बाद “इस calculation से My Stock देखें” button आखिरी calculated AstroSnapshot को shared App state में रखकर stock page खोलता है।
- [x] Stock page उसी selected calculation time, location और ग्रह snapshot से active rule ranking चलाता है; अलग या पुराने snapshot का उपयोग नहीं करता।
