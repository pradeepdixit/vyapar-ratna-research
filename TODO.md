
## File-only NEXT 10 CANDLE PREDICTION

- [x] Prediction page current AstroSnapshot को uploaded NIFTY minute file के historical rows से match करता है।
- [x] Candidate historical row current selected time से पहले की ही ली जाती है; future rows input नहीं बनतीं।
- [x] हर valid match के बाद की वास्तविक 1–10 minute OHLC rows से अलग-अलग तेजी/मंदी/सम परिणाम निकाले जाते हैं।
- [x] Match count, similarity percentage, historical evidence और प्रत्येक horizon का bullish/bearish ratio दिखता है।
- [x] पर्याप्त matches न होने पर `INSUFFICIENT HISTORICAL MATCH` दिखता है।
- [x] External market data, fabricated OHLC, RSI, MACD और technical indicators शामिल नहीं हैं।
