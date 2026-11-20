
## Nearest-match prediction fallback

- [x] Degree tolerance अब hard stop नहीं है; engine सभी valid historical rows में से nearest matches rank करता है।
- [x] सबसे कम mean circular planetary difference वाला historical match #1 दिखता है।
- [x] हर result पर similarity, mean degree difference और `within tolerance`/`nearest fallback` label दिखता है।
- [x] Tolerance के अंदर matches कम हों तो prediction खाली नहीं रहती; low-confidence warning के साथ nearest historical result दिखता है।
