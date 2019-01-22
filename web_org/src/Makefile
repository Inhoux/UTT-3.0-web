all:tplBuild langBuild helpBuild


tplBuild:
	tmod ./tpl --type cmd --output ../tpl --no-watch

tplClean:
	rm ../tpl -rf
	rm ./tpl/package.json -rf

langBuild:
	./langBuild.sh

helpBuild:
	./helpBuild.sh

langClean:
	rm ../lang -rf


clean: tplClean langClean

	
