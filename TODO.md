
## Online NIFTY minute data viewer

- [x] Supplied `NIFTY_50_1MIN_2015_2026_panchang_updated.xlsx` को browser-friendly 45 quarterly gzip chunks में बदला गया; original 1.2GB CSV/Excel browser में एक साथ नहीं खुलता।
- [x] Online viewer में 10,20,592 records, सभी 105 columns, NIFTY Data sheet, Methodology और Color Legend शामिल हैं।
- [x] User year/quarter चुन सकता है; केवल चुना chunk load होता है। Search, date/time filter, sticky headers, 100-row pagination और responsive table मौजूद हैं।
- [x] Chunk integrity, row counts, column counts, typecheck, tests और production build सफल रहे।
