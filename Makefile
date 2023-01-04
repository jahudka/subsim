.PHONY: default
default: build

.PHONY: clean
clean:
	rm -f public/*

.PHONY: build
build: clean
	node_modules/.bin/parcel build --cache-dir var/cache/parcel --dist-dir public src/index.html

.PHONY: run
run:
	node_modules/.bin/parcel serve --cache-dir var/cache/parcel --dist-dir public src/index.html
