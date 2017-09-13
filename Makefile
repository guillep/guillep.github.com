.ecstatic:
	git clone -b pharo61 https://github.com/guillep/ecstatic.git .ecstatic
	cd .ecstatic && ./_scripts/install.sh

generate: .ecstatic
	.ecstatic/ecstatic generate
	
serve: generate
	.ecstatic/ecstatic serve -w
	
clean:
	rm -rf .ecstatic
	rm -rf _site