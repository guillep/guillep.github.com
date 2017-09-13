.ecstatic:
	git clone -b pharo61 https://github.com/guillep/ecstatic.git .ecstatic
	cd .ecstatic && ./_scripts/install.sh

generate: .ecstatic
	.ecstatic/ecstatic generate
	
serve: generate
	.ecstatic/ecstatic serve -w

clonedeploy:
	rm -rf _site
	git clone -b master `git config --get remote.origin.url` _site

deploy: generate
	cd _site && git init
	cd _site && git add .
	cd _site && git commit -m "Generated from source branch: `cd .. && git log -1 --oneline`"
	cd _site && git remote add origin "https://$(GH_TOKEN)@github.com/guillep/guillep.github.com.git"
	cd _site && git push -f origin master

clean:
	rm -rf .ecstatic
	rm -rf _site